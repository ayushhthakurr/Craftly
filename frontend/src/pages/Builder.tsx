import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Wand2, Send } from 'lucide-react';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileNode } from '@webcontainer/api';
import { Loader } from '../components/Loader';

const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    })

    if (updateHappened) {
      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => ({
        ...s,
        status: "completed"
      })))
    }
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      files.forEach(file => processFile(file, true));
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Modern Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-xl">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Craftly Builder</h1>
                <p className="text-sm text-slate-400 truncate max-w-lg">{prompt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {llmMessages.filter(x => x.role === "user").length >= 1 && (
                <button
                  onClick={() => {
                    setLlmMessages([])
                    setSteps([])
                    setFiles([])
                    setTemplateSet(false)
                  }}
                  className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl border border-slate-600/50"
                >\n                  Reset Project\n                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {(loading || !templateSet) && <Loader />}

      {!loading && templateSet && (
        <div className="max-w-[2000px] mx-auto p-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            {/* Build Steps Sidebar - 3 columns */}
            <div className="col-span-3 flex flex-col gap-4">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex-1">
                <StepsList 
                  steps={steps} 
                  currentStep={currentStep} 
                  onStepClick={setCurrentStep}
                />
              </div>
              
              {/* Chat Section */}
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  AI Assistant
                </h3>
                {llmMessages.length > 0 && (
                  <div className="h-28 overflow-y-auto bg-slate-900/60 rounded-xl p-3 mb-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {llmMessages.map((message, index) => (
                      <div key={index} className={`text-xs leading-relaxed ${
                        message.role === "user" 
                          ? "text-blue-300 font-medium bg-blue-950/30 px-2 py-1 rounded" 
                          : "text-slate-400"
                      }`}>
                        {message.content}
                      </div>
                    ))}\n                  </div>
                )}
                {!(loading || !templateSet) && llmMessages.filter(x => x.role === "user").length >= 1 && (
                  <div className="flex gap-2">
                    <textarea 
                      value={userPrompt} 
                      onChange={(e) => setPrompt(e.target.value)} 
                      placeholder="Ask for modifications..."
                      rows={2}
                      className="flex-1 px-3 py-2 bg-slate-900/60 text-white text-sm rounded-xl border border-slate-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none placeholder-slate-500"
                    />
                    <button 
                      onClick={async () => {
                        const newMessage = {
                          role: "user" as "user",
                          content: userPrompt
                        };

                        setLoading(true);
                        const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                          messages: [...llmMessages, newMessage]
                        });
                        setLoading(false);

                        setLlmMessages(x => [...x, newMessage]);
                        setLlmMessages(x => [...x, {
                          role: "assistant",
                          content: stepsResponse.data.response
                        }]);

                        setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                          ...x,
                          status: "pending" as "pending"
                        }))]);
                      }} 
                      className="px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl transition-all text-sm font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* File Explorer - 3 columns */}
            <div className="col-span-3">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 h-full overflow-hidden">
                <FileExplorer 
                  files={files} 
                  onFileSelect={setSelectedFile}
                />
              </div>
            </div>

            {/* Code/Preview Panel - 6 columns */}
            <div className="col-span-6">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 h-full flex flex-col overflow-hidden">
                <TabView activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'code' ? (
                    <CodeEditor file={selectedFile} />
                  ) : (
                    webcontainer ? (
                      <PreviewFrame webContainer={webcontainer} files={files} />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-slate-400 font-medium">Loading WebContainer...</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}