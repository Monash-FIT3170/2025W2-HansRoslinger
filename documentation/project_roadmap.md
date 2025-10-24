# Project Roadmap

_Last Updated: 24 October 2025_

## Overview

This document outlines the planned milestones, current progress, and future direction of the **HansRoslinger (Yubi)** project, a gesture-based presentation tool designed to make online presentations more engaging and human-centered.

- **Full Feature Board:** [View on Notion](https://www.notion.so/1e5bafbd25c880b9a933e6c0d8e69b05?v=1e5bafbd25c880a59805000c91fe1994)
- **Timeline & Milestones:** [View Excel Sheet](https://docs.google.com/spreadsheets/d/1j5xe4BOyqqbd-Eg-Ch-ObfBEQyYvTfCL/edit?usp=sharing&ouid=111627141306080701207&rtpof=true&sd=true)

## Project Goals

The **HansRoslinger (Yubi)** project aims to revolutionize online presentations by creating a more interactive, expressive, and human-centered experience.  
Our goals focus on enhancing both the presenter’s control and the audience’s engagement through natural, intuitive interaction.

### Core Goals

- **Place the presenter at the center of the presentation experience**, ensuring gestures, movement, and presence remain integral to communication.
- **Enable gesture-based control** using MediaPipe for navigation, interaction, and annotation without traditional input devices.
- **Integrate dynamic visual elements** such as charts, images, and annotations to make presentations more engaging and data-driven.
- **Create a seamless, interactive interface** that supports real-time updates, fluid animations, and clear user feedback.
- **Enhance usability and accessibility** with responsive layouts, clear visual feedback, and planned voice-command functionality.
- **Provide scalability and maintainability** through modular architecture, reusable components, and cloud integration (Vercel, AWS S3, Prisma).

## Feature Roadmap

### Completed Features

- Register and login functionality
- Interactive user interface
- Upload assets (PNG or Vega-Lite JSON)
- Create and add assets to collections
- Integrate **Vega-Lite** for chart manipulation
- Integrate **MediaPipe** for gesture recognition
- Gesture-to-action mapping:
  - Pinch → Drag
  - Double pinch → Resize
  - Point → Interact with data points
  - Open palm → Hover
- Integrate **Canvas** for annotations (drawing and erasing)
- Sidebar for adding/removing assets from favorite collections
- Pinch-to-click mechanism for smoother interactions
- Open-palm hover for buttons and clickable elements
- Basic undo functionality
- “Clear all” to reset all elements on screen
- Background removal (MediaPipe) with blur and green screen options
- Layering system to place the presenter in front of assets

---

### In Progress

- Customizing graph styles
- Full-screen presentation mode

---

### Future Directions

- Voice-activated control
- Extended undo/redo functionality
- Improved asset management:
  - Delete assets
  - Move assets between collections
  - Rename assets and collections
- Upload validation (only supported file types)
- Support for additional upload formats
- Virtual assistant for navigation and app usage
- Infinite canvas
- 3D asset integration
- Multi-collaborator presentations
- OBS integration for use as a conferencing app
