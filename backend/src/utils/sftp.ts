import SFTPClient from 'ssh2-sftp-client';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

interface SFTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

/**
 * Downloads a file from SFTP server to local destination
 * @param remotePath - Path to the file on the SFTP server
 * @param localPath - Local path where the file should be saved
 * @returns Promise that resolves when download is complete
 */
export async function downloadFileFromFTP(
  remotePath: string,
  localPath: string
): Promise<void> {
  const sftp = new SFTPClient();

  const config: SFTPConfig = {
    host: process.env.SFTP_HOST || '',
    port: parseInt(process.env.SFTP_PORT || '22', 10),
    username: process.env.SFTP_USERNAME || '',
    password: process.env.SFTP_PASSWORD || '',
  };

  // Validate configuration
  if (!config.host || !config.username) {
    throw new Error('SFTP configuration is incomplete. Please check environment variables.');
  }

  try {
    console.info(`Connecting to SFTP server at ${config.host}:${config.port}`);
    
    await sftp.connect(config);

    console.info(`Downloading file from ${remotePath} to ${localPath}`);
    
    // Download the file
    await sftp.get(remotePath, localPath);

    console.info(`File downloaded successfully: ${localPath}`);
  } catch (error) {
    console.error(`Error downloading file from SFTP: ${error}`);
    throw error;
  } finally {
    await sftp.end();
    console.info('SFTP connection closed');
  }
}

/**
 * Downloads a file from SFTP server as a stream
 * @param remotePath - Path to the file on the SFTP server
 * @param localPath - Local path where the file should be saved
 * @returns Promise that resolves when download is complete
 */
export async function downloadFileFromFTPStream(
  remotePath: string,
  localPath: string
): Promise<void> {
  const sftp = new SFTPClient();

  const config: SFTPConfig = {
    host: process.env.SFTP_HOST || '',
    port: parseInt(process.env.SFTP_PORT || '22', 10),
    username: process.env.SFTP_USERNAME || '',
    password: process.env.SFTP_PASSWORD || '',
  };

  // Validate configuration
  if (!config.host || !config.username) {
    throw new Error('SFTP configuration is incomplete. Please check environment variables.');
  }

  try {
    console.info(`Connecting to SFTP server at ${config.host}:${config.port}`);
    
    await sftp.connect(config);
    
    console.info(`Streaming file from ${remotePath} to ${localPath}`);
    
    // Get readable stream from SFTP
    const readStream = sftp.createReadStream(remotePath);
    const writeStream = createWriteStream(localPath);
    
    // Pipe the streams
    await pipeline(readStream, writeStream);
    
    console.info(`File streamed successfully: ${localPath}`);
  } catch (error) {
    console.error(`Error streaming file from SFTP: ${error}`);
    throw error;
  } finally {
    await sftp.end();
    console.info('SFTP connection closed');
  }
}

/**
 * Lists files in a remote directory
 * @param remotePath - Path to the directory on the SFTP server
 * @returns Promise that resolves with an array of file information
 */
export async function listFilesFromFTP(remotePath: string): Promise<any[]> {
  const sftp = new SFTPClient();

  const config: SFTPConfig = {
    host: process.env.SFTP_HOST || '',
    port: parseInt(process.env.SFTP_PORT || '22', 10),
    username: process.env.SFTP_USERNAME || '',
    password: process.env.SFTP_PASSWORD || '',
  };

  // Validate configuration
  if (!config.host || !config.username) {
    throw new Error('SFTP configuration is incomplete. Please check environment variables.');
  }

  try {
    console.info(`Connecting to SFTP server at ${config.host}:${config.port}`);
    
    await sftp.connect(config);
    
    console.info(`Listing files in ${remotePath}`);
    
    const files = await sftp.list(remotePath);
    
    console.info(`Found ${files.length} files/directories`);
    
    return files;
  } catch (error) {
    console.error(`Error listing files from SFTP: ${error}`);
    throw error;
  } finally {
    await sftp.end();
    console.info('SFTP connection closed');
  }
}

export async function getFileStreamFromFTP(remotePath: string): Promise<{ stream: NodeJS.ReadableStream; sftp: SFTPClient }> {
  const sftp = new SFTPClient();

  const config: SFTPConfig = {
    host: process.env.SFTP_HOST || '',
    port: parseInt(process.env.SFTP_PORT || '22', 10),
    username: process.env.SFTP_USERNAME || '',
    password: process.env.SFTP_PASSWORD || '',
  };

  if (!config.host || !config.username) {
    throw new Error('SFTP configuration is incomplete. Please check environment variables.');
  }

  try {
    console.info(`Connecting to SFTP server at ${config.host}:${config.port}`);
    await sftp.connect(config);
    
    console.info(`Getting stream for file: ${remotePath}`);
    const stream = sftp.createReadStream(remotePath);
    
    return { stream, sftp };
  } catch (error) {
    console.error(`Error getting file stream from SFTP: ${error}`);
    await sftp.end();
    throw error;
  }
}
