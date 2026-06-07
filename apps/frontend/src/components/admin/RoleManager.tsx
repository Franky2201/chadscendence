import { useState } from "react";
import type { Role, Permission } from "@chad/types";
import { Card, Button, Input, Checkbox, Badge, Title } from "../ui";

interface RoleManagerProps {
	roles: Role[];
	permissions: Permission[];
	onCreate: (name: string, perms: string[]) => Promise<void>;
	onUpdate: (id: string, name: string, perms: string[]) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
}

export default function RoleManager({ roles, permissions, onCreate, onUpdate, onDelete }: RoleManagerProps) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState("");
	const [editPerms, setEditPerms] = useState<string[]>([]);

	const [isCreating, setIsCreating] = useState(false);
	const [newName, setNewName] = useState("");
	const [newPerms, setNewPerms] = useState<string[]>([]);

	const immutableRoles = ["User", "Admin"];

	const startEdit = (role: Role) => {
		setEditingId(role.id);
		setEditName(role.name);
		setEditPerms(role.permissions.map((p) => p.action));
	};

	const togglePermission = (action: string) => {
		setEditPerms((prev) =>
			prev.includes(action) ? prev.filter((p) => p !== action) : [...prev, action]
		);
	};

	const submitEdit = async () => {
		if (!editingId) return;
		await onUpdate(editingId, editName, editPerms);
		setEditingId(null);
	};

	const submitCreate = async () => {
		if (!newName.trim()) return;
		await onCreate(newName, newPerms);
		setIsCreating(false);
		setNewName("");
		setNewPerms([]);
	};

	return (
		<div className="flex flex-col gap-6 w-full">
			<Title color="white" className="text-2xl font-bold">Gestion des Rôles</Title>
			<div className="flex flex-col gap-4">
				{roles.map((role) => {
					const isImmutable = immutableRoles.includes(role.name);
					const isEditing = editingId === role.id;
					const roleName = role.name + " - " + (role.userCount);

					return (
						<Card key={role.id} title={isEditing ? "Modification du rôle" : roleName} className="w-full" contentClassName="w-full">
							{isEditing ? (
								<div className="flex flex-col gap-4">
									<Input
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										color="white"
										className="!text-left"
									/>
									<div className="flex flex-wrap gap-2">
										{permissions.map((p) => (
											<Checkbox
												key={p.id}
												label={p.action}
												checked={editPerms.includes(p.action)}
												onChange={() => togglePermission(p.action)}
											/>
										))}
									</div>
									<div className="flex gap-4 w-full">
										<Button color="pink" className="flex-1" onClick={submitEdit}>Valider</Button>
										<Button color="grey" className="flex-1" onClick={() => setEditingId(null)}>Annuler</Button>
									</div>
								</div>
							) : (
								<div className="flex flex-col gap-4">
									<div className="flex flex-wrap gap-2">
										{role.permissions.map((p) => (
											<Badge key={p.id} color="pink" color2="white">{p.action}</Badge>
										))}
									</div>
									{!isImmutable && (
										<div className="flex gap-4 w-full mt-2">
											<Button color="blue" className="flex-1" onClick={() => startEdit(role)}>Modifier</Button>
											<Button color="red" className="flex-1" onClick={() => onDelete(role.id)}>Supprimer</Button>
										</div>
									)}
								</div>
							)}
						</Card>
					);
				})}
			</div>

			{isCreating ? (
				<Card className="w-full mt-4" color="pink">
					<div className="flex flex-col gap-4">
						<Title color="pink" className="text-xl">Nouveau rôle</Title>
						<Input
							placeholder="Nom du rôle"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							color="white"
							className="!text-left"
						/>
						<div className="flex flex-wrap gap-2 mt-2">
							{permissions.map((p) => (
								<Checkbox
									key={p.id}
									label={p.action}
									checked={newPerms.includes(p.action)}
									onChange={() => setNewPerms(prev => prev.includes(p.action) ? prev.filter(x => x !== p.action) : [...prev, p.action])}
								/>
							))}
						</div>
						<div className="flex gap-4 w-full mt-4">
							<Button color="pink" className="flex-1" onClick={submitCreate}>Créer</Button>
							<Button color="grey" className="flex-1" onClick={() => { setIsCreating(false); setNewName(""); setNewPerms([]); }}>Annuler</Button>
						</div>
					</div>
				</Card>
			) : (
				<div className="flex justify-center mt-6 w-full">
					<Button color="pink" size="large" className="w-full" onClick={() => setIsCreating(true)}>
						Ajouter un rôle
					</Button>
				</div>
			)}
		</div>
	);
}
