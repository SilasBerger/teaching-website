export const loadJS = (url: string) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        script.src = url;
    });
}
