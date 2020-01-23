/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNote = `mutation CreateNote(
  $input: CreateNoteInput!
  $condition: ModelNoteConditionInput
) {
  createNote(input: $input, condition: $condition) {
    id
    note
    owner
    _version
    _deleted
    _lastChangedAt
  }
}
`;
export const updateNote = `mutation UpdateNote(
  $input: UpdateNoteInput!
  $condition: ModelNoteConditionInput
) {
  updateNote(input: $input, condition: $condition) {
    id
    note
    owner
    _version
    _deleted
    _lastChangedAt
  }
}
`;
export const deleteNote = `mutation DeleteNote(
  $input: DeleteNoteInput!
  $condition: ModelNoteConditionInput
) {
  deleteNote(input: $input, condition: $condition) {
    id
    note
    owner
    _version
    _deleted
    _lastChangedAt
  }
}
`;
