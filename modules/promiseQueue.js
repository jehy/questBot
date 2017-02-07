"use strict";

const runPromiseQueue = function (arr, index = 0) {
  return arr[index]().then(function () {
      if (index === arr.length - 1) {
        return true;
      }
      else return runPromiseQueue(arr, index + 1);
    })
};

module.exports = runPromiseQueue;