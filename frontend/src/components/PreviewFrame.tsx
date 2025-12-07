import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState("");

  async function main() {
    try {
      console.log('Installing dependencies...');
      const installProcess = await webContainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
        }
      }));

      const installExitCode = await installProcess.exit;
      
      if (installExitCode !== 0) {
        console.error('Installation failed with exit code:', installExitCode);
        return;
      }

      console.log('Starting dev server...');
      
      // Listen for server-ready event
      webContainer.on('server-ready', (port, url) => {
        console.log('Server ready on port:', port, 'URL:', url);
        setUrl(url);
      });

      // Start the dev server
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
      
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('Dev server:', data);
        }
      }));

    } catch (error) {
      console.error('Error starting preview:', error);
    }
  }

  useEffect(() => {
    if (webContainer && files.length > 0) {
      main();
    }
  }, [files])
  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center">
        <p className="mb-2">Loading preview...</p>
        <p className="text-sm">Check console for details</p>
      </div>}
      {url && (
        <iframe 
          width="100%" 
          height="100%" 
          src={url}
          allow="cross-origin-isolated"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        />
      )}
    </div>
  );
}

