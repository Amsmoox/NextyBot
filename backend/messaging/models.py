from django.db import models
import json

class SignalTemplate(models.Model):
    name = models.CharField(max_length=100, default='default')
    template = models.TextField(help_text='Signal template with tokens like {pair}, {type}, etc.')
    publish_mode = models.CharField(
        max_length=20, 
        choices=[('immediate', 'Immediate'), ('scheduled', 'Scheduled')],
        default='immediate'
    )
    scheduled_time = models.CharField(max_length=10, blank=True, null=True)
    telegram_enabled = models.BooleanField(default=True)
    quality_filter = models.CharField(max_length=20, default='medium')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Template: {self.name}"

    @classmethod
    def get_active_template(cls):
        """Get the currently active template"""
        return cls.objects.filter(is_active=True).first()
