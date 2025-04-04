import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityLogger extends Logger {
  constructor() {
    super('Security');
  }

  logSecurityEvent(type: string, details: any) {
    const event = {
      timestamp: new Date().toISOString(),
      type,
      details,
    };

    // Логируем события безопасности
    this.warn(`Security Event: ${JSON.stringify(event)}`);
  }

  logSuspiciousActivity(ip: string, action: string, details: any) {
    this.logSecurityEvent('SUSPICIOUS_ACTIVITY', {
      ip,
      action,
      details,
    });
  }

  logAuthFailure(username: string, ip: string, reason: string) {
    this.logSecurityEvent('AUTH_FAILURE', {
      username,
      ip,
      reason,
    });
  }

  logAccessDenied(ip: string, resource: string, reason: string) {
    this.logSecurityEvent('ACCESS_DENIED', {
      ip,
      resource,
      reason,
    });
  }
}
