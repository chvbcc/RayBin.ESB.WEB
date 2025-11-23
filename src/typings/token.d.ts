declare namespace Api {
  namespace Token {
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Token
      /* Token search params */
      type TokenSearchParams = Partial<Pick<Token, 'tokenName' | 'method' | 'requestUrl' | 'startCreateTime' | 'endCreateTime'> & Common.CommonSearchParams>;

      /* Token */
      type Token = Common.CommonRecord<{
        tokenName: string;
        method: string | undefined;
        requestUrl: string;
        timeOut: number;
        headers: string;
        queryParameters: string;
        bodyType: string;
        bodyContent: string;
        authType: string;
        authContent: string;
        programmeLanguage: string;
        checkCallResult: string;
        tokenField: string;
        description: string;
        startCreateTime: string | undefined;
        endCreateTime: string | undefined;
      }>;

      type TokenList = Common.PaginatingQueryRecord<Token>;
      /* Token model */
      type TokenModel = Pick<Token, | 'id' | 'tokenName' | 'method' | 'requestUrl' | 'timeOut' | 'headers' | 'queryParameters' | 'bodyType' | 'bodyContent' | 'authType' | 'authContent' | 'programmeLanguage' | 'checkCallResult' | 'tokenField' | 'description' | 'startCreateTime' | 'endCreateTime'>;


      type ParamType = 'String' | 'Integer' | 'Boolean' | 'Number' | 'Object' | 'Array' | 'Any';
      type Param = {
        name: string;
        value: string;
        valueType: ParamType;
        description?: string;
      }
    }
  }
