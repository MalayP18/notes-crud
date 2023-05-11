const NoteSchema = {
    title: {
        required: { value: true, message: 'Title is required.' }
    },
    content: {
        required: { value: true, message: 'Content is required.' }
    },
};

export default NoteSchema;