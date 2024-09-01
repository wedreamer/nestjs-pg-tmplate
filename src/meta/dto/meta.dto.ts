export class ControllerInfo {
  name!: string;
  describe!: string;
  context!: string;
  methods!: {
    name: string;
    describe: string;
    context: string;
  }[];
}
