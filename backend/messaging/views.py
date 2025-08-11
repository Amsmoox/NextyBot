from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services.telegram_bot import TelegramBot
from .models import SignalTemplate
from scrapers.models import ScrapedData
import json


@api_view(['POST'])
def send_telegram_alert(request):
    return Response({"status": "ok", "message": "Alert received"})


@api_view(['POST'])
def update_template(request):
    """Update or create the signal template"""
    try:
        data = request.data
        
        # Get or create the active template
        template, created = SignalTemplate.objects.get_or_create(
            name='default',
            defaults={
                'template': data.get('template', ''),
                'publish_mode': data.get('publishMode', 'immediate'),
                'scheduled_time': data.get('scheduledTime', ''),
                'telegram_enabled': data.get('telegramEnabled', True),
                'quality_filter': data.get('qualityFilter', 'medium'),
                'is_active': True
            }
        )
        
        if not created:
            # Update existing template
            template.template = data.get('template', template.template)
            template.publish_mode = data.get('publishMode', template.publish_mode)
            template.scheduled_time = data.get('scheduledTime', template.scheduled_time)
            template.telegram_enabled = data.get('telegramEnabled', template.telegram_enabled)
            template.quality_filter = data.get('qualityFilter', template.quality_filter)
            template.save()
        
        return Response({
            "status": "success", 
            "message": "Template updated successfully",
            "template_id": template.id
        })
    
    except Exception as e:
        return Response({
            "status": "error", 
            "message": f"Failed to update template: {str(e)}"
        }, status=500)


@api_view(['GET'])
def get_template(request):
    """Get the current active template"""
    try:
        template = SignalTemplate.get_active_template()
        if template:
            return Response({
                "status": "success",
                "data": {
                    "template": template.template,
                    "publish_mode": template.publish_mode,
                    "scheduled_time": template.scheduled_time,
                    "telegram_enabled": template.telegram_enabled,
                    "quality_filter": template.quality_filter,
                    "updated_at": template.updated_at
                }
            })
        else:
            return Response({
                "status": "warning",
                "message": "No active template found"
            })
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"Failed to get template: {str(e)}"
        }, status=500)


@api_view(['GET'])
def fetch_and_send_signals(request):
    """Fetch the latest forex signals from the database and send them to Telegram using dynamic template."""
    try:
        # Get the active template
        template_obj = SignalTemplate.get_active_template()
        
        # Get the 5 most recent successful and processed signals
        signals = ScrapedData.objects.filter(
            status='success', 
            is_processed=True
        ).order_by('-scrape_date')[:5]
        
        if not signals:
            return Response({"status": "warning", "message": "No signals found"})

        bot = TelegramBot()
        results = []

        for signal in signals:
            if template_obj and template_obj.template:
                # Use dynamic template
                msg = template_obj.template
                
                # Replace tokens with signal data
                msg = msg.replace('{pair}', signal.instrument or '')
                msg = msg.replace('{type}', signal.action or '')
                msg = msg.replace('{entry}', str(signal.entry_price) if signal.entry_price else '')
                msg = msg.replace('{target}', str(signal.take_profit) if signal.take_profit else '')
                msg = msg.replace('{stopLoss}', str(signal.stop_loss) if signal.stop_loss else '')
                msg = msg.replace('{timeframe}', signal.timeframe or '')
                msg = msg.replace('{analysis}', signal.comments or '')
                msg = msg.replace('{source}', 'FXLeaders')
                
                # Add timestamp
                if signal.scrape_date:
                    msg = msg.replace('{timestamp}', signal.scrape_date.strftime('%Y-%m-%d %H:%M'))
            else:
                # Fallback to default template if no custom template exists
                signal_emoji = "🔴" if signal.action and signal.action.lower() == "sell" else "🟢"
                
                msg = (
                    f"{signal_emoji} <b>{signal.instrument}</b>\n"
                    f"<b>Action:</b> {signal.action}\n"
                )
                
                # Add optional fields if they exist
                if signal.entry_price:
                    msg += f"<b>Entry:</b> {signal.entry_price}\n"
                if signal.stop_loss:
                    msg += f"<b>Stop Loss:</b> {signal.stop_loss}\n"
                if signal.take_profit:
                    msg += f"<b>Take Profit:</b> {signal.take_profit}\n"
                if signal.status_signal:
                    msg += f"<b>Status:</b> {signal.status_signal}\n"
                    
                # Add timestamp and source
                msg += f"\n<i>Scraped on: {signal.scrape_date.strftime('%Y-%m-%d %H:%M')}</i>"
            
            # Send the message to Telegram
            result = bot.send_message(msg)
            results.append({
                "signal_id": signal.id,
                "telegram_result": result
            })

        return Response({
            "status": "success", 
            "message": f"Sent {len(results)} signals to Telegram", 
            "details": results
        })

    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)
