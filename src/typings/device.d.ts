declare namespace Api {
  namespace DeviceConnection {
    /* Device Connection search params */
    type DeviceConnectionSearchParams = Partial<Pick<DeviceConnection, 'connectionName' | 'deviceName' | 'deviceModel' | 'address'> & Common.CommonSearchParams >;

    /* Connection list */
    type DeviceConnectionList = Common.PaginatingQueryRecord<DeviceConnection>;
    type DeviceConnectionOptions = Pick<DeviceConnection, 'id' | 'connectionName'>[];

    /* Device Connection */
    type DeviceConnection = Common.CommonRecord<{
      id: number;
      connectionName: string;
      manufacturerID: number | undefined;
      deviceName: string;
      deviceModel: string;
      address: string;
      username: string;
      password: string;
    }>;

    /* Device Connection model */
    type DeviceConnectionModel = Pick<DeviceConnection, | 'id' | 'connectionName' | 'manufacturerID' | 'deviceName' | 'deviceModel' | 'address' | 'username' | 'password'>;

    // Manufacturer
    type ManufacturerList = Manufacturer[];
    type Manufacturer = {
        id: number;
        name: string;
        logo: string;
        toptip: string;
        createTime: Date;
    };
  }
}
