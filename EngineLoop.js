"use strict";
// Parameter: world
//  world must implement:
//  - initialize()
//  - render()
//  - update(milliseconds)
//  - preRender()
// Usage:
//  let engineLoop = new EngineLoop(world);
//  engineLoop.initialize();
//  engineLoop.run();
export class EngineLoop {
   constructor(world) {
      let _thisEngine = {};
      let _world = world;
      _thisEngine.lastTickMS = 0;

      // 17ms ~ 58.8Hz (1000 / 17)
      this.initialize = function _initialize(tickLengthMS = 17) {
         _thisEngine.lastTickMS = performance.now();
         // Pretend the first draw was on first update.
         _thisEngine.lastRender = _thisEngine.lastTickMS;
         _thisEngine.tickLengthMS = tickLengthMS;
         _world.initialize();
      };

      this.run = function _run() {
         _thisEngine.running = true;
         _thisEngine.lastTickMS = performance.now();
         _world.preRender();
         _main(_thisEngine.lastTickMS);
      };

      this.pause = function _pause() {
         window.cancelAnimationFrame(_thisEngine.stopMain);
         _thisEngine.running = false;
      };

      this.togglePause = function () {
         if (_thisEngine.running) {
            _thisEngine.pause();
            _world.preRender();
            _world.render();
         }
         else {
            this.run();
         }
      };

      // Source: https://developer.mozilla.org/en-US/docs/Games/Anatomy
      function _main(lastTickMS) {
         _thisEngine.stopMain = window.requestAnimationFrame(_main);
         let nextTickMS = _thisEngine.lastTickMS + _thisEngine.tickLengthMS;
         let tickCount = 0;
         // If lastTickMS < nextTickMS then 0 ticks need to be updated (0 is default for tickCount).
         // If lastTickMS = nextTickMS then 1 tick needs to be updated (and so forth).
         // If tickCount is large, then either your game was asleep, or the machine cannot keep up.
         if (lastTickMS >= nextTickMS) {
            let timeSinceTick = lastTickMS - _thisEngine.lastTickMS;
            tickCount = Math.floor(timeSinceTick / _thisEngine.tickLengthMS);
         }
         _queueUpdates(tickCount);
         _world.render();
         _thisEngine.lastRender = lastTickMS;
      }

      function _queueUpdates(numberOfTicks) {
         for (let i = 0; i < numberOfTicks; i++) {
            _thisEngine.lastTickMS = _thisEngine.lastTickMS + _thisEngine.tickLengthMS;
            _world.update(_thisEngine.tickLengthMS);
         }
      }
   }
}