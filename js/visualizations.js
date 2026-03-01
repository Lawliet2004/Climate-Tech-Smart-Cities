/**
 * Scaffolding for interactive charts and diagrams rendered via Canvas/SVG.
 * Chapters will call specific init functions here when they load.
 */

const Visualizations = {
    // Shared utility for setting up a Canvas with High DPI support
    setupCanvas: function(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        return { canvas, ctx, width: rect.width, height: rect.height };
    },

    // Example initialization for a specific chapter
    initChapter1Timeline: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Build an interactive SVG or standard HTML timeline
        // This will be implemented fully in chapter 1
    },
    
    // Example: Initialize Climate Feedback Loop diagram
    initFeedbackLoopsDiagram: function(containerId) {
        // Implementation for Chapter 2
    }
};

// Global export
window.Visualizations = Visualizations;
