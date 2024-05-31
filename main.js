"use strict";

import { EngineLoop } from './EngineLoop.js';
import { World } from './World.js';
import { ThreeJSEngine } from './ThreeJSEngine.js';

const canvas = document.querySelector('#drawingArea');

let engineLoop = new EngineLoop(new World(new ThreeJSEngine(canvas)));
engineLoop.initialize();
engineLoop.run();