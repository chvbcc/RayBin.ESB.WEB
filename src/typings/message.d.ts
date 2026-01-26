declare namespace Api {
  namespace Message {
    /* Task search params */
    type TaskSearchParams = Partial<Pick<Api.Task.Task, 'taskName' | 'taskType' | 'runMode'> & Pick<Api.SystemManage.User, 'employeeName'> & Common.CommonSearchParams >;

    type UserSearchParams = Partial<Pick<Message, 'taskID'> & Common.CommonSearchParams>;

    /* Message list */
    type MessageList = Message[];


    /* Message type  0 WeCom 企业微信  1 DingTalk 钉钉 2 TextMessage 短信  3 Email 邮件 */
    type MessageType = 0 | 1 | 2 | 3;

    /* Message */
    type Message = Common.CommonRecord<{
      taskID: number;
      userID: number;
      messageType: MessageType;
      messageContent: string;
    }> & Api.SystemManage.User;

    /* Message model */
    type MessageModel = Pick<Message, 'id' | 'taskID' | 'userID' | 'messageType' | 'messageContent'>;
  }
}
