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

    /* Task status 0 No, 1 Enabled */
    type TaskStatus = 0 | 1;

    type DataObjectType = 'table' | 'view' | 'storedProcedure';

    /* Task list */
    type TaskList = Common.PaginatingQueryRecord<Task>;

    type Task = {
      id: number;
      taskType: TaskType;
      taskName: string;
      runMode: RunMode;
      runTime: string;
      runFrequency: string;
      dataHandle: DataHandle;
      programmeLanguage: string;
      dataHandleScript: string;
      isDebug: boolean;
      status: TaskStatus;
      description: string;
      createUserID: number;
      createTime: string;
    };

    /* Task database */
    type TaskDatabase = {
      id: number;
      taskID: number;
      connectionID: number | undefined;
      dataObjectType: DataObjectType;
      dataMapping: string;
      createUserID: number;
      createTime: string;
    };

    type TaskDatabaseModel = Task & TaskDatabase;
    /* Task webapi */
    /* Task industry plc */
  }
}
