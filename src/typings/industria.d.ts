declare namespace Api {
  namespace Industria {

    /* Industria Api Search Params */
    type IndustriaApiSearchParams = Partial<Pick<IndustriaApi, 'interfaceName' | 'interfaceType' | 'deviceName' | 'status'> & Common.CommonSearchParams >;

    /* Industria Api List */
    type IndustriaApiList = Common.PaginatingQueryRecord<IndustriaApi>;

    /* Industria Api Interface Type 0 ReadNode 1 WriteNode 2 SubscribeNode */
    type InterfaceType = 0 | 1 | 2
    type Status = 0 | 1 | 2;
    /* Industria Api */
    type IndustriaApi = Common.CommonRecord<{
      id: number;
      interfaceName: string;
      connectionID: number | undefined;
      deviceName: string;
      interfaceType: InterfaceType;
      description: string;
      status: Status;
    }>;

    /* Industria Api Model */
    type ApiModel = Pick<IndustriaApi, | 'id' | 'interfaceName' | 'connectionID' | 'interfaceType' | 'description' | 'status'>;

    /* Industria Api Detail List */
    type IndustriaApiDetailList = Common.PaginatingQueryRecord<IndustriaApiDetail>;

    /* Industria Api Detail */
    type IndustriaApiDetail = Common.CommonRecord<{
      id: number;
      industriaApiID: number;
      nodeName: string;
      nodeID: string;
      nodeClass: string;
      variableName: string;
      builtInType: string;
      attributeName: string;
      dataType: string;
      description: string;
    }>;

    /* Industria Api Detail Model */
    type ApiDetailModel = Pick<IndustriaApiDetail, | 'id' | 'industriaApiID' | 'nodeName' | 'nodeID' | 'nodeClass' | 'variableName' | 'builtInType' | 'attributeName' | 'dataType' | 'description'>;

    type IndustriaApiModel = { industriaApi: ApiModel; industriaApiDetail: ApiDetailModel []; deleteIndustriaIds: number[]};
  }
}
