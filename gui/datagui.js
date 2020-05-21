class ControlsSpeedPlanets {
  constructor(dataControls) {
    this.dataControls = dataControls;
    this.init();
  }

  init() {
    var gui = new dat.GUI();
    gui
      .add(this.dataControls, "SIMULATION_SPEED_ROTATION", 0, 3)
      .onChange(function(value) {
        this.dataControls.SIMULATION_SPEED_ROTATION = value;
      });
    gui
      .add(this.dataControls, "SIMULATION_SPEED_ORBIT", 0, 3)
      .onChange(function(value) {
        this.dataControls.SIMULATION_SPEED_ORBIT = value;
      });
  }
}

export default ControlsSpeedPlanets;
