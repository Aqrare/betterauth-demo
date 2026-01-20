import Layout from "../components/Layout";
import { Section, InputField, Toggle, Button } from "../components/FormComponents";
import { authClient } from "../lib/auth";

export default function Settings() {
	const { data: session } = authClient.useSession();

	return (
		<Layout title="Settings" subtitle="Manage your account settings">
			<div className="max-w-4xl space-y-6">
				{/* Profile Settings */}
				<Section title="Profile Information">
					<div className="space-y-4">
						<InputField
							label="User ID"
							value={session?.user.id}
							disabled
							monospace
						/>
						<InputField
							label="Name"
							value={session?.user.name}
						/>
						<InputField
							label="Email"
							type="email"
							value={session?.user.email}
							disabled
							helperText="Email cannot be changed"
						/>
					</div>
				</Section>

				{/* Password Settings */}
				<Section title="Password">
					<div className="space-y-4">
						<InputField label="Current Password" type="password" />
						<InputField label="New Password" type="password" />
						<InputField label="Confirm New Password" type="password" />
						<Button>Update Password</Button>
					</div>
				</Section>

				{/* Account Settings */}
				<Section title="Account">
					<div className="space-y-4">
						<Toggle
							label="Two-Factor Authentication"
							description="Add an extra layer of security"
						/>
					</div>
				</Section>

				{/* Danger Zone */}
				<Section title="Danger Zone" variant="danger">
					<div className="space-y-4">
						<div className="p-4 bg-white/30 rounded-xl">
							<p className="font-medium text-red-900 mb-2">Delete Account</p>
							<p className="text-sm text-red-800 mb-4">
								Once you delete your account, there is no going back. Please be certain.
							</p>
							<Button variant="danger">Delete Account</Button>
						</div>
					</div>
				</Section>
			</div>
		</Layout>
	);
}
