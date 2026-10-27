import { Button, Modal } from "@/shared/ui";

export default function DeleteConfirmModal({ isOpen, transaction, isDeleting, onClose, onConfirm }) {
    if (!transaction) return null;

    return (
        <Modal isOpen={isOpen} onClose={() => !isDeleting && onClose()} title="Confirm Deletion">
            <p className="text-sm text-slate-600">
                Are you sure you want to delete <span className="font-semibold text-slate-900">"{transaction.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-2">
                <Button
                    type="button"
                    disabled={isDeleting}
                    onClick={onClose}
                    className="w-auto px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-none border-none"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    disabled={isDeleting}
                    onClick={onConfirm}
                    className="w-auto px-5 py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700 shadow-none border-none"
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </Modal>
    );
}
