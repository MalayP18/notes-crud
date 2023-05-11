import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, TextField, InputAdornment } from '@mui/material';
import "./Notes.scss";
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Note from '../../interfaces/Note';
import AddEditNote from './add-edit-note/AddEditNote';
import DeleteNote from './delete-note/DeleteNote';
import ViewNote from './view-note/ViewNote';
import SearchIcon from '@mui/icons-material/Search';


type Order = 'asc' | 'desc';

const Notes = () => {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Note>();
    const notes = useAppSelector((state: RootState) => state.notes.notes);
    const [isDelete, setIsDelete] = useState(false);
    const [noteId, setNoteId] = useState('');
    const [notesData, setNotesData] = useState<Note[]>();
    const [isView, setIsView] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');

    useEffect(() => {
        setNotesData(notes);
    }, [notes]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);

    useEffect(() => {
        // Filter the notes based on the search query
        const filteredNotes = notes.filter(
            (note: Note) =>
                note.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
        setNotesData(filteredNotes);
    }, [notes, debouncedSearchQuery]);

    const handleSort = (property?: keyof Note) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property || '' as keyof Note);
    };

    const sortedRows = notesData?.slice().sort((a: any, b: any) => {
        if (!orderBy) {
            return 0;
        }
        const isAsc = order === 'asc';
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (typeof aVal === 'string') {
            return isAsc ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
        }
        return isAsc ? (aVal - bVal) : bVal - aVal;
    });

    const handleDeleteNote = (id: string) => {
        setNoteId(id);
        setIsDelete(true);
    };

    const resetData = () => {
        setIsDelete(false);
        setNoteId('');
        setIsView(false);
        setIsEdit(false);
    }

    const handleViewNote = (id: string) => {
        setIsView(true);
        setNoteId(id);
    }

    const handleEdit = (id: string) => {
        setNoteId(id);
        setIsEdit(true);
    }

    return (
        <div className='notes-container'>
            <div className='header'>
                <TextField
                    id="input-with-icon-textfield"
                    hiddenLabel
                    placeholder='Search'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => { setSearchQuery(e.target.value) }}
                    variant="standard"
                />
                <AddEditNote id={noteId} isOpen={isEdit} resetData={() => { setNoteId(''); setIsEdit(false) }} />
            </div>
            <div>
                {isDelete && <DeleteNote noteId={noteId} isDeleteNote={isDelete} resetData={resetData} />}
            </div>
            <div>
                {isView && <ViewNote id={noteId} resetData={resetData} />}
            </div>
            <div className='table-container'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left' width='10%'>
                                <TableSortLabel active={orderBy === 'title'} direction={order} onClick={() => handleSort('title')}>
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='left' width='50%'>
                                <TableSortLabel active={orderBy === 'content'} direction={order} onClick={() => handleSort('content')}>
                                    Content
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='left' width='15%'>
                                <TableSortLabel active={orderBy === 'created_at'} direction={order} onClick={() => handleSort('created_at')}>
                                    Created Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='left' width='15%'>
                                <TableSortLabel active={orderBy === 'updated_at'} direction={order} onClick={() => handleSort('updated_at')}>
                                    Updated Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='left' width='10%'>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRows?.map((row: Note) => (
                            <TableRow key={row.id} hover>
                                <TableCell align='left' onClick={() => { handleViewNote(row?.id) }}>{row.title}</TableCell>
                                <TableCell className='content' align='left' onClick={() => { handleViewNote(row?.id) }}>{row.content}</TableCell>
                                <TableCell align='left' onClick={() => { handleViewNote(row?.id) }}>{new Date(row?.created_at).toISOString()}</TableCell>
                                <TableCell align='left' onClick={() => { handleViewNote(row?.id) }}>{new Date(row?.updated_at).toISOString()}</TableCell>
                                <TableCell align='left'>
                                    <div className="actions-container">
                                        <EditIcon onClick={() => { handleEdit(row?.id) }} />
                                        <DeleteIcon className='delete-icon' onClick={() => { handleDeleteNote(row?.id) }} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Notes;
