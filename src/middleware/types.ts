/*
 * Future generated types from Async API Spec
 */
// NOTE: this is not a great example because it actually should get its shape from a message event
export interface AppMentionEvent {
  type: 'app_mention';
  user: string;
  text: string;
  ts: string;
  channel: string;
  event_ts: string;
}

export interface GroupOpenEvent {
  type: 'group_open';
  user: string;
  channel: string;
}

// NOTE: this should probably be broken into its two subtypes
export interface EmojiChangedEvent {
  type: 'emoji_changed';
  subtype: 'add' | 'remove';
  names?: string[];
  name?: string;
  value?: string;
  event_ts: string;
}

// TODO: this is just a draft of the actual message event
export interface MessageEvent {
  type: 'message';
  channel: string;
  user: string;
  text: string;
  ts: string;
}

// TODO: script to generate these types

export type SlackEvent =
  | AppMentionEvent
  | GroupOpenEvent
  | EmojiChangedEvent
  | MessageEvent;

/*
 * Slack Events API Types
 */

export interface UnknownSlackEvent {
  type: string;
}

type KnownEventFromType<T extends string> = Extract<SlackEvent, { type: T }>;
type EventFromType<T extends string> = KnownEventFromType<T> extends never ? UnknownSlackEvent : KnownEventFromType<T>;

interface WrappedSlackEvent<EventBody> {
  token: string;
  team_id: string;
  enterprise_id?: string;
  api_app_id: string;
  event: EventBody;
  type: 'event_callback';
  event_id: string;
  event_time: number;
  // TODO: is this optional?
  authed_users: string[];
}

export interface SlackEventMiddlewareArgs<EventType extends string> {
  payload: EventFromType<EventType>;
  event: this['payload'];
  message: EventType extends 'message' ? this['payload'] : never;
  body: WrappedSlackEvent<this['payload']>;
  // TODO: faking it, but do this for real later
  // say: HasChannelContext<E>;
  say: (message: string | { text: string; [key: string]: any }) => void;
}

/*
 * Slack Action Types
 */

export interface ButtonClick {
  type: 'button';
  name: string;
  value: string;
}

export interface MenuSelect {
  type: 'select';
  name: string;
  selected_options: {
    value: string;
  }[];
}

export type InteractiveAction = ButtonClick | MenuSelect;

export interface InteractiveMessage<Action extends InteractiveAction> {
  type: 'interactive_message';
  callback_id: string;
  actions: [Action];
  team: {
    id: string;
    domain: string;
    enterprise_id?: string; // undocumented
    enterprise_name?: string; // undocumented
  };
  user: {
    id: string;
    name: string;
    team_id?: string; // undocumented
  };
  channel: {
    id: string;
    name: string;
  };
  action_ts: string;
  attachment_id?: string;
  token: string;
  response_url: string;
  trigger_id: string;

  is_app_unfurl?: boolean; // undocumented

  // NOTE: the original_message is not available from ephemeral messages
  // TODO: confirm optionality of message_ts, if these are always either both available or neither, how can the type
  // system express that?
  message_ts?: string;
  original_message?: { [key: string]: string; };
}

export interface DialogSubmitAction {
  type: 'dialog_submission';
  callback_id: string;
  submission: { [name: string]: string };
  state: string;
  team: {
    id: string;
    domain: string;
    enterprise_id?: string; // undocumented
    enterprise_name?: string; // undocumented
  };
  user: {
    id: string;
    name: string;
    team_id?: string; // undocumented
  };
  channel: {
    id: string;
    name: string;
  };
  action_ts: string;
  token: string;
  response_url: string;
}

export interface MessageAction {
  type: 'message_action';
  callback_id: string;
  trigger_id: string;
  message_ts: string; // undocumented
  response_url: string;
  // TODO: are all of these really non-optional?
  message: {
    type: 'message';
    user?: string; // undocumented that this is optional, it won't be there for bot messages
    ts: string;
    text?: string; // undocumented that this is optional, but how could it exist on block kit based messages?
    [key: string]: any;
  };
  user: {
    id: string;
    name: string;
    team_id?: string; // undocumented
  };
  channel: {
    id: string;
    name: string;
  };
  team: {
    id: string;
    domain: string;
    enterprise_id?: string; // undocumented
    enterprise_name?: string; // undocumented
  };
  token: string;
  action_ts: string; // undocumented
}

export type SlackAction =
  | InteractiveMessage<ButtonClick>
  | InteractiveMessage<MenuSelect>
  | DialogSubmitAction
  | MessageAction;

export interface SlackActionMiddlewareArgs<ActionType extends SlackAction> {
  payload: ActionType;
  action: this['payload'];
  body: this['payload'];
  // say: HasChannelContext<ActionType>;
  // ack: Ack<ActionType>;
  // respond: HasResponseUrl<ActionType>;
}

/*
 * Slack Command Types
 */

export interface SlackCommandMiddlewareArgs {
  payload: {
    token: string;
    command: string;
    text: string;
    response_url: string;
    trigger_id: string;
    user_id: string;
    user_name: string;
    team_id: string;
    team_domain: string;
    channel_id: string;
    channel_name: string;
    enterprise_id?: string;
    enterprise_name?: string;
  };
  command: this['payload'];
  body: this['payload'];
  // say: Say;
  // ack: Ack<Message>;
  // respond: Respond;
}

/*
 * Slack Options Types
 */

export interface SlackOptionsMiddlewareArgs<Within extends 'interactive_message' | 'dialog_suggestion'> {
  payload: {
    name: string;
    value: string;
    callback_id: string;
    type: Within,
    team: {
      id: string;
      domain: string;
      enterprise_id?: string; // undocumented
      enterprise_name?: string; // undocumented
    };
    channel: {
      id: string;
      name: string;
    };
    user: {
      id: string;
      name: string;
      team_id?: string; // undocumented
    },
    action_ts: string;
    message_ts?: string; // not when within a dialog
    attachment_id?: string; // not when within a dialog
    token: string;
  };
  body: this['payload'];
  // ack: Ack<Within>;
}

/*
 * General Type helpers
 */

export type AnyMiddlewareArgs =
  | SlackEventMiddlewareArgs<string>
  | SlackActionMiddlewareArgs<SlackAction>
  | SlackCommandMiddlewareArgs
  | SlackOptionsMiddlewareArgs<'interactive_message' | 'dialog_suggestion'>;

export interface Context {
  [key: string]: any;
}

// NOTE: Args should extend AnyMiddlewareArgs, but because of contravariance for function types, including that as a
// constraint would mess up the interface of Slapp#event(), Slapp#message(), etc.
export interface Middleware<Args> {
  // TODO: is there something nice we can do to get context's property types to flow from one middleware to the next?
  (args: Args & { next: NextMiddleware, context: Context }): void;
}

export interface NextMiddleware {
  (error: Error): void;
  (postProcess: PostProcessFn): void;
  (): void;
}

// TODO: should this any be unknown type?
export interface PostProcessFn {
  (error: Error | undefined, done: (error?: Error) => void): any;
}
