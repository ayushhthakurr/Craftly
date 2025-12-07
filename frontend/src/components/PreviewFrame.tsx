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
    <div className="h-full w-full relative bg-white">
      {!url && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-700 font-semibold mb-1">Preparing preview...</p>
            <p className="text-sm text-slate-500">Installing dependencies and starting dev server</p>
          </div>
        </div>
      )}
      {url && (
        <iframe 
          className="w-full h-full border-0"
          src={url}
          allow="cross-origin-isolated"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox"
        />
      )}
    </div>
  );
}

