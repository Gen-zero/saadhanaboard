import { useEffect, useRef, useState } from 'react';
import type { AdminLog, SecurityEvent } from '@/types/admin-logs';

const SOCKET_URL = (import.meta.env.VITE_SOCKET_BASE_URL as string) || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3004');

export function useLogStream(onLog: (l: AdminLog) => void, onEvent?: (e: SecurityEvent) => void) {
  const socketRef = useRef<any>(null);
  const esRef = useRef<EventSource | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    // try Socket.IO first
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const io = require('socket.io-client');
      const s = io(SOCKET_URL, { withCredentials: true, path: '/socket.io' });
      socketRef.current = s;
      s.on('connect', () => { if (mounted) setConnected(true); });
      s.on('logs:new', (payload: AdminLog) => { try { onLog && onLog(payload); } catch (e) { console.error(e); } });
      s.on('security:alert', (payload: any) => { try { onEvent && onEvent(payload); } catch (e) { } });
    } catch (e) {
      console.warn('Socket.IO not available, falling back to SSE', e);
    }

    // SSE fallback
    if (!socketRef.current) {
      try {
        const es = new EventSource(`${(import.meta.env.VITE_ADMIN_API_BASE as string) || '/api/admin'}/logs/stream`, { withCredentials: true } as any);
        esRef.current = es;
        es.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data || '{}');
            if (data && data.type === 'logs:new' && data.payload) onLog && onLog(data.payload);
          } catch (e) { console.error('SSE parse error', e); }
        };
        es.onerror = () => { if (mounted) setConnected(false); };
      } catch (e) { console.error('SSE init failed', e); }
    }

    return () => {
      mounted = false;
      try { if (socketRef.current) socketRef.current.disconnect(); } catch (e) {}
      try { if (esRef.current) esRef.current.close(); } catch (e) {}
    };
  }, []);

  return { connected, socket: socketRef.current };
}
