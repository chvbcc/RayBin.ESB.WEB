declare namespace Api {
  namespace Log {
    /* Task log search params */
    type TaskLogSearchParams = Partial<Pick<TaskLog, 'taskID' | 'taskType' | 'taskName' | 'logLevel' | 'startCreateTime' | 'endCreateTime'> & Common.CommonSearchParams >;

    /* TaskLog list */
    type TaskLogList = Common.PaginatingQueryRecord<TaskLog>;


    /* Log levels  0 info  1 Successc 2 warning  2 Failure  3 debug */
    type LogLevel = 0 | 1 | 2 | 3 | 4;

    /* TaskLog */
    type TaskLog = Common.CommonRecord<{
      taskID: number;
      taskType: Api.Task.TaskType;
      taskName: string;
      logLevel: LogLevel;
      message: string;
      spentTime: number;
      startCreateTime: string | undefined;
      endCreateTime: string | undefined;
    }>;

    /* TaskLog model */
    type TaskLogModel = Pick<TaskLog, 'id' | 'taskID' | 'taskType' | 'taskName' | 'logLevel' | 'message' | 'spentTime' | 'createUserID' | 'createTime'>;
  }
}
