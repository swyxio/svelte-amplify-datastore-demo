/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncNotes = `query SyncNotes(
  $filter: ModelNoteFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncNotes(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      note
      owner
      _version
      _deleted
      _lastChangedAt
    }
    nextToken
    startedAt
  }
}
`;
export const getNote = `query GetNote($id: ID!) {
  getNote(id: $id) {
    id
    note
    owner
    _version
    _deleted
    _lastChangedAt
  }
}
`;
export const listNotes = `query ListNotes(
  $filter: ModelNoteFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      note
      owner
      _version
      _deleted
      _lastChangedAt
    }
    nextToken
    startedAt
  }
}
`;
