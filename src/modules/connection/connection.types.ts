import { ConnectionConstantsCollection } from './connection.constant.ts';
import type { ConnectionFieldsType } from './connection.model.ts';

type CreateConnectionAllowedStatusType =
  (typeof ConnectionConstantsCollection.CreateConnectionAllowedStatus)[number];

export interface ConnectionTypeCollection {
  ConnectionFieldsType: ConnectionFieldsType;
  CreateConnectionAllowedStatusType: CreateConnectionAllowedStatusType;
}
