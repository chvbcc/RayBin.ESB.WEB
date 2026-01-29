declare namespace Api {
  namespace Message {
    /* Task search params */
    type TaskSearchParams = Partial<Pick<Api.Task.Task, 'taskName' | 'taskType' | 'runMode'> & Pick<Api.SystemManage.User, 'employeeName'> & Common.CommonSearchParams >;

    type UserSearchParams = Partial<Pick<Message, 'taskID' | 'searchFieldName' | 'searchKeyWord'> & Common.CommonSearchParams>;

    /* Message list */
    type MessageList = Message[];

    /* Message type  0 WeCom 企业微信  1 DingTalk 钉钉 2 TextMessage 短信  3 Email 邮件 */
    type MessageType = 0 | 1 | 2 | 3;

    /* Message insert fields  0 taskID  1 taskName  2 runModeTime  3 runTime */
    type MessageInsertFields = 0 | 1 | 2 | 3;

    /* User serarch fields  0 username  1 employeeName  2 employeeNo  3 phone 4 email */
    type UserSearchFields = 0 | 1 | 2 | 3 | 4;

    /* Message */
    type Message = Common.CommonRecord<{
      taskID: number;
      userID: number;
      userIds: number[];
      messageType: MessageType;
      emailSubject: string;
      messageContent: string;
      searchFieldName: string;
      searchKeyWord: string;

    }> & Api.SystemManage.User;

    /* Message model */
    type MessageModel = Pick<Message, 'id' | 'taskID' | 'userID' | 'userIds' | 'messageType' | 'emailSubject' | 'messageContent'>;
  }
}
