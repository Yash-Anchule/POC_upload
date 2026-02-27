import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pocService } from '../services/endpoints';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

export default function PocForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        techStack: [],
        demoLink: '',
        repoLink: '',
        status: 'draft',
    });
    const [tagInput, setTagInput] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    const fetchPoc = useCallback(async () => {
        try {
            const { data } = await pocService.getById(id);
            const poc = data.poc;
            setForm({
                title: poc.title,
                description: poc.description,
                techStack: poc.techStack || [],
                demoLink: poc.demoLink || '',
                repoLink: poc.repoLink || '',
                status: poc.status,
            });
            if (poc.thumbnail) setPreview(poc.thumbnail);
        } catch {
            setError('Failed to load POC');
        } finally {
            setFetching(false);
        }
    }, [id]);

    useEffect(() => {
        if (isEdit) fetchPoc();
    }, [isEdit, fetchPoc]);

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        if (!form.description.trim()) errs.description = 'Description is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const tag = tagInput.trim();
            if (!form.techStack.includes(tag)) {
                setForm({ ...form, techStack: [...form.techStack, tag] });
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        setForm({ ...form, techStack: form.techStack.filter((t) => t !== tag) });
    };

    const handleThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setError('');
        setLoading(true);

        try {
            const payload = { ...form };
            /* Convert techStack array to JSON string for FormData */
            payload.techStack = form.techStack;
            if (thumbnail) payload.thumbnail = thumbnail;

            if (isEdit) {
                await pocService.update(id, payload);
            } else {
                await pocService.create(payload);
            }
            navigate('/pocs');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} POC`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <Spinner size="lg" className="mt-24" />;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-charcoal-800 mb-6">
                {isEdit ? 'Edit POC' : 'Submit New POC'}
            </h1>

            <Card hover={false} className="p-6 sm:p-8">
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-coral-50 border border-coral-200 text-sm text-coral-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Title"
                        placeholder="My Awesome POC"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        error={errors.title}
                        required
                    />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-charcoal-700">Description</label>
                        <textarea
                            className="w-full rounded-xl border border-sand-300 hover:border-sand-400 bg-white px-4 py-2.5 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 focus:outline-none transition-all duration-200 resize-none"
                            rows={5}
                            placeholder="Describe your proof of concept..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                        />
                        {errors.description && <p className="text-xs text-coral-500">{errors.description}</p>}
                    </div>

                    {/* Tech Stack tags */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-charcoal-700">Tech Stack</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.techStack.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-medium"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-terracotta-900 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input
                            placeholder="Type a tag and press Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                        />
                    </div>

                    <Input
                        label="Demo Link"
                        placeholder="https://demo.example.com"
                        value={form.demoLink}
                        onChange={(e) => setForm({ ...form, demoLink: e.target.value })}
                    />

                    <Input
                        label="Repository Link"
                        placeholder="https://github.com/org/repo"
                        value={form.repoLink}
                        onChange={(e) => setForm({ ...form, repoLink: e.target.value })}
                    />

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-charcoal-700">Status</label>
                        <div className="flex gap-3">
                            {['draft', 'published'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setForm({ ...form, status: s })}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${form.status === s
                                            ? 'bg-terracotta-500 text-white shadow-sm'
                                            : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
                                        }`}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-charcoal-700">Thumbnail</label>
                        {preview && (
                            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-2" />
                        )}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleThumbnail}
                            className="text-sm text-charcoal-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-terracotta-50 file:text-terracotta-600 hover:file:bg-terracotta-100 file:cursor-pointer file:transition-colors"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" loading={loading}>
                            {isEdit ? 'Update POC' : 'Submit POC'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => navigate('/pocs')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
