/**
 * @author Alex / https://github.com/al3xpisani
 * @param loadBar This param is the name of the first outer div
 * @param loadProgressBar This param is the inner div that goes inside the loadBar

 */

var LoadingManager = function () {
  this.setLoadManager = function (loadBar, loadProgressBar) {
    var manager = new THREE.LoadingManager();

    var progress = document.getElementById(loadBar);
    var progressBar = document.getElementById(loadProgressBar);

    manager.onStart = function (url, loaded, total) {
      progress.style.display = "block";
      progressBar.style.display = "block";
    };

    manager.onProgress = function (item, loaded, total) {
      progressBar.style.width = ((loaded / total) * 100).toFixed(2) + "%";
    };

    manager.onLoad = function () {
      progress.style.display = "none";
      progressBar.style.display = "none";
    };

    // //funcao e for para testes da barra de progressao
    // function addRandomPlaceHoldItImage() {
    //   var r = Math.round(Math.random() * 4000);
    //   new THREE.ImageLoader(manager).load("http://placehold.it/" + r + "x" + r);
    // }
    // for (var i = 0; i < 220; i++) addRandomPlaceHoldItImage();

    return manager;
  };
};
export { LoadingManager };
