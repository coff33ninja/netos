import * as pty from 'node-pty';
import { WebSocket } from 'ws';

interface ConsoleSession {
    terminal: any; // node-pty.IPty
    ws: WebSocket;
}

export class ConsoleManager {
    private sessions: Map<string, ConsoleSession> = new Map();

    public createSession(sessionId: string, ws: WebSocket) {
        const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
        const terminal = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.cwd(),
            env: process.env as { [key: string]: string }
        });

        terminal.onData((data) => {
            ws.send(JSON.stringify({ type: 'console', data }));
        });

        this.sessions.set(sessionId, { terminal, ws });

        return sessionId;
    }

    public sendCommand(sessionId: string, command: string) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.terminal.write(command + '\r');
        }
    }

    public closeSession(sessionId: string) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.terminal.kill();
            this.sessions.delete(sessionId);
        }
    }
}