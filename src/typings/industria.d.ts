declare namespace Api {
  namespace Industria {


    /* Industria Api search params */
    type IndustriaApiSearchParams = Partial<Pick<IndustriaApi, 'interfaceName' | 'interfaceType' | 'deviceName' | 'status'> & Common.CommonSearchParams >;

    /* Industria Api list */
    type IndustriaApiList = Common.PaginatingQueryRecord<IndustriaApi>;
    //type IndustriaApiOptions = Pick<IndustriaApi, 'id' | 'interfaceName'>[];

    /* Industria Api interface type 0 ReadNode 1 WriteNode 2 SubscribeNode */
    type InterfaceType = 0 | 1 | 2
    type Status = 0 | 1 | 2;
    /* Industria Api */
    type IndustriaApi = Common.CommonRecord<{
      id: number;
      interfaceName: string;
      connectionID: number;
      deviceName: string;
      interfaceType: InterfaceType;
      description: string;
      status: Status;
    }>;

    /* Industria Api model */
    type IndustriaApiModel = Pick<IndustriaApi, | 'id' | 'interfaceName' | 'connectionID' | 'interfaceType' | 'description' | 'status'>;
  }
}
