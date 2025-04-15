export default function ResumeCardSkeleton() {
    return (
        <div className="border rounded-lg p-4 shadow-sm bg-muted animate-pulse h-[170px] space-y-3">
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
            <div className="flex gap-2 mt-4">
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
                <div className="h-5 w-12 bg-gray-200 rounded-full" />
            </div>
        </div>
    );
}
