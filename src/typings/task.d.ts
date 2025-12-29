declare namespace Api {
  namespace Task {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Task Common
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //#region Task Common
    // Task search params
    type TaskSearchParams = Partial<Pick<Task, 'taskName' | 'taskType' | 'runMode' | 'description' | 'status'> & Common.CommonSearchParams >;

    // Task 5000 Database, 5001 WebApi, 5002 Industry PLC
    type TaskType = '5000' | '5001' | '5002';

    // Run mode 6000 Manual Operation, 6001 Every Day, 6002 Monthly, 6003 Annually, 6004 Time Interval
    type RunMode = '6000' | '6001' | '6002' | '6003' | '6004';

    // Data handle 0 No, 1 Yes
    type DataHandle = 0 | 1;

    // Task status 0 Normal, 1 Draft 2 Paused
    type TaskStatus = 0 | 1 | 2;

    type DataObjectType = 'table' | 'view' | 'storedProcedure';

    // Task list
    type TaskList = Common.PaginatingQueryRecord<Task>;

    type Task = Common.CommonRecord<{
      id: number;
      taskType: TaskType;
      taskName: string;
      runMode: RunMode;
      runTime: string | null | undefined;
      runFrequency: number;
      dataHandle: DataHandle;
      programmeLanguage: string;
      dataHandleScript: string;
      isDebug: boolean;
      status: TaskStatus;
      description: string;
    }>;
    type TaskModel = Pick<Task, | 'id' | 'taskType' | 'taskName' | 'runMode' | 'runTime' | 'runFrequency' | 'dataHandle' | 'programmeLanguage' | 'dataHandleScript' | 'isDebug' | 'status' | 'description'>;

    // Mapping Dialog
    type DialogModal = {
      connectionID: number | undefined;
      dataObjectType: DataObjectType;
    };
    //#endregion

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Database Task
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //#region Database Task
    type TaskDatabase = {
      id: number;
      taskID: number;
      dataMapping: string;
      diagramData: string;
    };

    type DataObjectNode = {
      id: string;
      shape: string;
      width: number;
      height: number;
      x: number;
      y: number;
      data?: Record<string, any>;
      attrs?: Record<string, any>;
      ports?: {
        items: Array<{
          id: string;
          group: string;
          keyType: string;
          attrs: Record<string, any>;
        }>;
      }
    }

    type TaskDatabaseModel = { task: TaskModel; taskDatabase: TaskDatabase;};
    //#endregion

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // WebApi Task
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //#region WebApi Task
    // 8000  Call,  8001 Pull, 8002 Push
    type InterfaceType = '8000' | '8001' | '8002';

    type TaskWebApi = {
      id: number;
      taskID: number;
      interfaceType: InterfaceType;
      authorize: number | undefined;
      method: string;
      requestUrl: string;
      timeOut: number;
      queryParameters: Param[];
      requestBody: BodyConfig;
      headers: Param[];
      tokenPassBy: number;
      tokenPrefix: string;
      responseBodyType: string;
      responseBodyContent: string;
      judgeMode: number;
      jdgeCondition: string;
      handleCallResult: string;
      dataMapping: string;
      diagramData: string;
      shareVariables: string;
    };

    type TaskWebApiModel = { task: TaskModel; taskWebApi: TaskWebApi[]};
    //#endregion

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // HTTP request
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //#region Http request
    enum ParamType {
      String = 0,
      Integer = 1,
      Boolean = 2,
      Number = 3,
      Object = 4,
      Array = 5,
      Any = 6
    }

    enum BodyType {
      None = 0,
      Json = 1,
      Xml = 2,
      Html = 3,
      Text = 4,
      FormData = 5,
      UrlEncoded = 6
    }

    type Param = {
      name: string;
      value: string;
      valueType: ParamType;
      description?: string;
    };

    type FormData = {
      name: string;
      value?: string;
      isFile: boolean;
      filePath?: string;
      contentType?: string;
    };

    type BodyConfig = {
      type: BodyType;
      raw?: string;
      formDatas?: FormData[];
      urlEncodeds?: Param[];
      binaryFilePath?: string;
    };
    //#endregion

    /* Task industry plc */
  }
}
