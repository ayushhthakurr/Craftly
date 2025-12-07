import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | null = null;

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();

    async function main() {
        if (!webcontainerInstance) {
            webcontainerInstance = await WebContainer.boot();
        }
        setWebcontainer(webcontainerInstance)
    }
    useEffect(() => {
        main();
    }, [])

    return webcontainer;
}