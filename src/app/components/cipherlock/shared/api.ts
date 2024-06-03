import io from "socket.io-client";

export function connectAdminWebsocket(serverUrl: string, apiKey: string) {
  const url = new URL(serverUrl)
  return io(`ws://${url.host}`, {
    extraHeaders: {
      apikey: apiKey,
    }
  });
}

export async function sendPublishGameRequest(serverUrl: string, apiKey: string, gameFileContent: string): Promise<Response> {
  return fetch(`${serverUrl}/admin/game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': apiKey,
    },
    body: gameFileContent,
  });
}

export async function sendCheckInRequest(serverUrl: string, gameId: string, playerId?: string): Promise<Response> {
  return fetch(`${serverUrl}/checkIn`, {
    method: 'POST',
    body: JSON.stringify({
      gameId: gameId,
      playerId: playerId,
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
