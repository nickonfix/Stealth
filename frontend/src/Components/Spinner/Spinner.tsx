import { ClipLoader } from 'react-spinners';
import './Spinner.css';
type Props = {
    isLoading?: boolean;
}

const Spinner = ({ isLoading = true }: Props) => {
    return (
        <>
            <div id="loading-spinner" className="flex flex-col items-center gap-4">
                <ClipLoader color='#ffffff'
                    loading={isLoading}
                    size={30}
                    aria-label='Loading Spinner'
                    data-testid='loader'
                />
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">Synchronizing...</span>
            </div>

        </>

    )
}

export default Spinner