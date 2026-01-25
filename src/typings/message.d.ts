declare namespace Api {
  namespace Message {
    /* Task log search params */
    type SearchParams = Partial<Pick<Message, 'taskName' | 'taskType' | 'runMode' | 'employeeName'> & Common.CommonSearchParams >;

    /* Message list */
    type MessageList = Message[];


    /* Message type  0 WeCom 企业微信  1 DingTalk 钉钉 2 TextMessage 短信  3 Email 邮件 */
    type MessageType = 0 | 1 | 2 | 3;

    /* Message */
    type Message = Common.CommonRecord<{
      taskID: number;
      taskType: Api.Task.TaskType;
      taskName: string;
      runMode: Api.Task.RunMode;
      runTime: string | null | undefined;
      status: Api.Task.TaskStatus;
      userID: number;
      employeeName: string;
      messageType: MessageType;
      messageContent: string;
    }>;

    /* Message model */
    type MessageModel = Pick<Message, 'id' | 'taskID' | 'userID' | 'messageType' | 'messageContent'>;
  }
}
