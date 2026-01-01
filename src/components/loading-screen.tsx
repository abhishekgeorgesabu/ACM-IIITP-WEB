
import React from 'react';
import { Loader2, Code2, Cpu, Globe } from 'lucide-react';

export const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
            <div className="relative flex items-center justify-center w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping delay-75"></div>
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping delay-1000"></div>

                {/* Orbiting Icons */}
                <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background p-1 rounded-full border border-border">
                        <Code2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-background p-1 rounded-full border border-border">
                        <Cpu className="w-6 h-6 text-accent" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background p-1 rounded-full border border-border">
                        <Globe className="w-6 h-6 text-primary" />
                    </div>
                </div>

                {/* Center Logo/Icon */}
                <div className="relative z-10 bg-background rounded-full p-4 border-2 border-primary shadow-lg shadow-primary/20 animate-pulse">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            </div>

            <h2 className="text-2xl font-bold font-headline animate-bounce text-primary mb-2">
                ACM IIIT Pune
            </h2>
            <p className="text-muted-foreground animate-pulse">
                Loading amazing things...
            </p>
        </div>
    );
};
