import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [filterGenre, setFilterGenre] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Pop',
    artist: '',
    rating: '',
    label: '',
    role: 'Creator',
  });

  const [errors, setErrors] = useState({});

  // Validation
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.title.trim() || formData.title.length < 3) {
      tempErrors.title = 'Title must be at least 3 characters long.';
    }
    if (!formData.artist.trim()) {
      tempErrors.artist = 'Artist name is required.';
    }
    const numRating = Number(formData.rating);
    if (!formData.rating || isNaN(numRating) || numRating < 1 || numRating > 100) {
      tempErrors.rating = 'Rating/BPM must be a number between 1 and 100.';
    }
    if (!formData.label.trim()) {
      tempErrors.label = 'Record Label Name is required.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newTrack = { id: Date.now(), ...formData, rating: Number(formData.rating) };
    setTracks((prev) => [...prev, newTrack]);

    setFormData({
      title: '',
      genre: 'Pop',
      artist: '',
      rating: '',
      label: '',
      role: 'Creator',
    });
    setErrors({});
    setActiveTab('table');
  };

  // Phase 3: Selection Sync
  useEffect(() => {
    if (tracks.length > 0 && !selectedTrack) {
      setSelectedTrack(tracks[tracks.length - 1]);
    }
  }, [tracks]);

  const filteredData = React.useMemo(() => {
    if (filterGenre === 'All') return tracks;
    return tracks.filter((t) => t.genre === filterGenre);
  }, [tracks, filterGenre]);

  const columns = React.useMemo(
    () => [
      { accessorKey: 'title', header: 'Track Title' },
      { accessorKey: 'artist', header: 'Artist' },
      { accessorKey: 'genre', header: 'Genre' },
      { accessorKey: 'rating', header: 'Rating / BPM' },
      { accessorKey: 'label', header: 'Record Label' },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (info) => (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              info.getValue() === 'Creator'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {info.getValue()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-green-400">Spotify Track & Playlist Manager</h1>
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'form' ? 'bg-green-500 text-black' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            Add Track
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'table' ? 'bg-green-500 text-black' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            Track Registry ({tracks.length})
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* PHASE 1: FORM */}
        {activeTab === 'form' && (
          <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Register New Track</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Track Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:outline-none focus:border-green-400"
                  placeholder="Min 3 characters"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:outline-none focus:border-green-400"
                  >
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Indie">Indie</option>
                    <option value="Jazz">Jazz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Artist Name</label>
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:outline-none focus:border-green-400"
                  />
                  {errors.artist && <p className="text-red-400 text-xs mt-1">{errors.artist}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating / BPM (1-100)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:outline-none focus:border-green-400"
                  />
                  {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Record Label Name</label>
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:outline-none focus:border-green-400"
                  />
                  {errors.label && <p className="text-red-400 text-xs mt-1">{errors.label}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">User Role</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="Creator"
                      checked={formData.role === 'Creator'}
                      onChange={handleChange}
                      className="accent-green-500"
                    />
                    Creator
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="Listener"
                      checked={formData.role === 'Listener'}
                      onChange={handleChange}
                      className="accent-green-500"
                    />
                    Listener
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-black font-bold py-2 rounded hover:bg-green-400 transition"
              >
                Submit Track
              </button>
            </form>
          </div>
        )}

        {/* PHASE 2 & 3: TABLE & CARD */}
        {activeTab === 'table' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Track Registry</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Filter Genre:</span>
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded p-1 text-sm"
                  >
                    <option value="All">All</option>
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Indie">Indie</option>
                    <option value="Jazz">Jazz</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No tracks submitted yet.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id} className="border-b border-slate-700 text-slate-400">
                            {headerGroup.headers.map((header) => (
                              <th key={header.id} className="p-3 text-sm">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody>
                        {table.getRowModel().rows.map((row) => (
                          <tr
                            key={row.id}
                            onClick={() => setSelectedTrack(row.original)}
                            className={`border-b border-slate-700 cursor-pointer transition ${
                              selectedTrack?.id === row.original.id
                                ? 'bg-slate-700/60 border-l-4 border-l-green-400'
                                : 'hover:bg-slate-700/30'
                            }`}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id} className="p-3 text-sm">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center mt-4 text-sm text-slate-400">
                    <div>
                      Page {table.getState().pagination.pageIndex + 1} of{' '}
                      {table.getPageCount() || 1}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 bg-slate-900 border border-slate-700 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 bg-slate-900 border border-slate-700 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
              <h2 className="text-xl font-semibold mb-4 border-b border-slate-700 pb-2">
                Active Detail Card
              </h2>
              {selectedTrack ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase">Title</span>
                    <p className="text-lg font-bold text-white">{selectedTrack.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-slate-400 uppercase">Artist</span>
                      <p className="font-medium">{selectedTrack.artist}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase">Genre</span>
                      <p className="font-medium">{selectedTrack.genre}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-slate-400 uppercase">Rating / BPM</span>
                      <p className="font-medium text-green-400">{selectedTrack.rating}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase">Record Label</span>
                      <p className="font-medium">{selectedTrack.label}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase block mb-1">Role Badge</span>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                        selectedTrack.role === 'Creator'
                          ? 'bg-green-500 text-black'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {selectedTrack.role}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Select a row in the table to view details.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}