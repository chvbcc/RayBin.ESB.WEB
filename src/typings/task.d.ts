declare namespace Api {
  namespace Task {
    /* Task search params */
    type TaskSearchParams = Partial<Pick<Task, 'taskName' | 'runMode' | 'description' | 'status'> & Common.CommonSearchParams >;

    /* Task 5000 Database, 5001 WebApi, 5002 Industry PLC */
    type TaskType = '5000' | '5001' | '5002';

    /* Run mode 6000 Manual Operation, 6001 Every Day, 6002 Monthly, 6003 Annually, 6004 Time Interval */
    type RunMode = '6000' | '6001' | '6002' | '6003' | '6004';

    /* Data handle 0 No, 1 Yes */
    type DataHandle = 0 | 1;

    /* Task status 0 Normal, 1 Draft 2 Disable */
    type TaskStatus = 0 | 1 | 2;

    type DataObjectType = 'table' | 'view' | 'storedProcedure';

    /* Task list */
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


    /* Mapping Dialog */
    type DialogModal = {
      connectionID: number | undefined;
      dataObjectType: DataObjectType;
    };

    /* Task database */
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
      ports?: Array<{
        id: string;
        group: string;
        keyType: string;
        attrs: Record<string, any>;
      }>;
    }

    type TaskDatabaseModel = { task: TaskModel; taskDatabase: TaskDatabase;};

    /* Task WebApi */
    // 8000  Call,  8001 Pull, 8002 Push
    type RequestType = '8000' | '8001' | '8002';

    type TaskWebApi = Common.CommonRecord<{
      id: number;
      taskID: number;
      requestType: RequestType;
      method: string;
      requestUrl: string;
      timeOut: number;
      queryParameters: string;
      bodyType: string;
      bodyContent: string;
      headers: string;
      authType: string;
      authContent: string;
      responseType: string;
      responseContent: string;
      judgeCallResult: string;
      handleCallResult: string;
      dataMapping: string;
      diagramData: string;
    }>;
    /* Task industry plc */
  }
}
