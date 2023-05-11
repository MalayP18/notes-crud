import { Button, Dialog, DialogActions, DialogTitle, TextField, DialogContent } from "@mui/material";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import Note from "../../../interfaces/Note";
import { RootState } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addNote, updateNote } from "../../../store/notes/Notes.slice";
import NoteSchema from "../NoteSchema";
import "./AddEditNote.scss";

type AddNoteProps = {
    id?: string,
    resetData?: Function,
    isOpen?: boolean
}

type Inputs = {
    title: string,
    content: string
}


const AddEditNote = ({ id, resetData, isOpen }: AddNoteProps) => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Inputs>({ mode: 'all' });
    const { content, title } = NoteSchema;
    const dispatch = useAppDispatch();
    const {notes} = useAppSelector((state: RootState) => state.notes);
    const [selectedData,setSelectedData] = useState<Note>();

    useEffect(() => {
        if(id && isOpen) {
            const selectedNote = notes?.find((item: any) => item.id === id);
            setSelectedData(selectedNote)
            setValue('content', selectedNote?.content, { shouldValidate: true });
            setValue('title', selectedNote?.title, { shouldValidate: true });
            setIsOpenModal(isOpen);
        }
    }, [id, notes, isOpen, setValue]);

    const handleClose = () => {
        setIsOpenModal(false);
        setSelectedData(undefined);
        resetData && resetData();
        reset();
    }

    const handleOpen = () => {
        setSelectedData(undefined);
        setIsOpenModal(true);
        reset();
    }

    const onSubmit = (values: Inputs) => {
        if (selectedData?.id) {
            const reqObj = {
                id: selectedData?.id ?? Math.random().toString(16).slice(2),
                ...values,
                created_at: selectedData?.created_at,
                updated_at: new Date().toString(),
            }
            dispatch(updateNote(reqObj));
            setSelectedData(undefined);
            resetData && resetData();
        } else {
            const reqObj = {
                id: Math.random().toString(16).slice(2),
                ...values,
                created_at: new Date().toString(),
                updated_at: new Date().toString(),
            }
            dispatch(addNote(reqObj));
        }
        setIsOpenModal(false);
        reset();
    }

    return (
        <div className="add-note-container">
            <Button variant='contained' onClick={handleOpen} className='add-note-button'>
                Add Note
            </Button>
            <Dialog open={isOpenModal} onClose={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle className="dialog-title">{`${id ? 'Edit' : 'Add'} Note`}</DialogTitle>
                    <DialogContent>
                        <div className="form-body">
                            <TextField
                                id="title"
                                label="Title"
                                variant="standard"
                                {...register('title', {
                                    ...title
                                })}
                                error={Boolean(errors && errors.title)}
                                helperText={errors && errors.title?.message}
                            />
                            <TextField
                                id="content"
                                multiline
                                minRows={2}
                                maxRows={3}
                                label="Content"
                                variant="standard"
                                {...register('content', {
                                    ...content
                                })}
                                error={Boolean(errors && errors.content)}
                                helperText={errors && errors.content?.message}
                            />
                        </div>
                    </DialogContent>

                    <DialogActions className="action-buttons-container">
                        <Button variant="contained" className="cancel-button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" type="submit" className="add-button">
                            {selectedData?.id ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
};

export default AddEditNote;