
export interface WolResult {
  success: boolean;
  message: string;
  deviceName: string;
}

export const wakeDevice = async (mac: string, deviceName: string): Promise<WolResult> => {
  try {
    // TODO: Implement actual Wake-on-LAN API call
    const response = await fetch('/api/wol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mac, deviceName }),
    });

    if (!response.ok) {
      throw new Error('Failed to send wake-up packet');
    }

    return {
      success: true,
      message: `Successfully sent wake-up packet to ${deviceName}`,
      deviceName
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to send wake-up packet to ${deviceName}: ${(error as Error).message}`,
      deviceName
    };
  }
};
