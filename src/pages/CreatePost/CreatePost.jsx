import { useOutletContext, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./CreatePost.css";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { dotSpinner } from "ldrs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ReactPlayer from "react-player";
import { Icon } from "@iconify/react/dist/iconify.js";
import { supabase } from "../../config/SupabaseClient";
import { storage } from "../../config/FirebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";

const CreatePost = () => {
	const [UID, theme] = useOutletContext();
	const navigate = useNavigate();
	const [postTitle, setPostTitle] = useState("");
	const [postFlair, setPostFlair] = useState(null);
	const [postContent, setPostContent] = useState("");
	const [postURL, setPostURL] = useState("");
	const [uploadURL, setUploadURL] = useState("");
	const [postID, setPostID] = useState(0);
	const [message, setMessage] = useState("");
	const [uploadFile, setUploadFile] = useState(null);
	const [filename, setFilename] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	const [open, setOpen] = useState(false);

	const [tabVal, setTabVal] = useState("1");

	const [secretKey, setSecretKey] = useState("");
	const [showSecretKey, setShowSecretKey] = useState(false);

	dotSpinner.register();

	const handleChange = (event, newValue) => {
		setTabVal(newValue);
	};

	const [urlType, setURLType] = useState("image");

	const handleSelectChange = (event) => {
		setURLType(event.target.value);
	};

	const handleCreatePost = async (event) => {
		event.preventDefault();
		setLoading(true);
		setOpen(true);
		if (postTitle === "") {
			var errorMessage = "Please enter a title for the post";
			if (postFlair === null) {
				errorMessage += " and assign a flair to the post";
			}
			errorMessage += ".";
			if (secretKey === "") {
				errorMessage +=
					" Make sure to also input a secret key for the post.";
			}
			setMessage(errorMessage);
			setError(true);
			setLoading(false);
		} else if (postFlair === null) {
			var errorMessage = "Please assign a flair to the post.";
			if (secretKey === "") {
				errorMessage +=
					" Make sure to also input a secret key for the post.";
			}
			setMessage(errorMessage);
			setError(true);
			setLoading(false);
		} else if (secretKey === "") {
			var errorMessage = "Please a secret key for the post.";
			setMessage(errorMessage);
			setError(true);
			setLoading(false);
		} else {
			if (urlType === "upload") {
				if (uploadFile === null) {
					const { data, error } = await supabase
						.from("posts")
						.insert({
							title: postTitle,
							content: postContent,
							user_id: UID,
							flair:
								postFlair.charAt(0).toUpperCase() +
								postFlair.slice(1),
							secret_key: secretKey,
						})
						.select()
						.single();
					if (error) {
						setError(true);
						setMessage(
							"There was an error with creating the post. Please try again."
						);
						setLoading(false);
					} else {
						setPostID(data.id);
						setSuccess(true);
						setLoading(false);
					}
				} else {
					const imgRef = ref(
						storage,
						`sekai-hub-images/${v4() + uploadFile.name}`
					);
					uploadBytes(imgRef, uploadFile)
						.then((res) => {
							getDownloadURL(res.ref).then(async (url) => {
								const { data, error } = await supabase
									.from("posts")
									.insert({
										title: postTitle,
										content: postContent,
										url: url,
										user_id: UID,
										video: false,
										flair:
											postFlair.charAt(0).toUpperCase() +
											postFlair.slice(1),
										secret_key: secretKey,
										uploaded: true,
									})
									.select()
									.single();
								if (error) {
									setError(true);
									setMessage(
										"There was an error with creating the post. Please try again."
									);
									setLoading(false);
								} else {
									setPostID(data.id);
									setSuccess(true);
									setLoading(false);
								}
							});
						})
						.catch((error) => {
							setError(true);
							setMessage(
								"There was an error with uploading your image. Please try again."
							);
							setLoading(false);
							return;
						});
				}
			} else {
				const { data, error } = await supabase
					.from("posts")
					.insert({
						title: postTitle,
						content: postContent,
						url: postURL,
						user_id: UID,
						video: urlType === "video",
						flair:
							postFlair.charAt(0).toUpperCase() +
							postFlair.slice(1),
						secret_key: secretKey,
					})
					.select()
					.single();
				if (error) {
					setError(true);
					setMessage(
						"There was an error with creating the post. Please try again."
					);
					setLoading(false);
				} else {
					setPostID(data.id);
					setSuccess(true);
					setLoading(false);
				}
			}
		}
	};

	const handleClose = () => {
		setOpen(false);
		if (error) {
			setError(false);
			setMessage("");
		}
		if (success) {
			setSuccess(false);
			setPostTitle("");
			setPostFlair(null);
			setPostContent("");
			setPostURL("");
			setURLType("image");
			setTabVal("1");
		}
	};

	const handleUpload = (event) => {
		const file = event.currentTarget.files[0];
		setUploadFile(file);
		setFilename(file.name);
		const reader = new FileReader();
		reader.onloadend = () => {
			const buffer = reader.result;

			// convert buffer to blob
			const blob = new Blob([new Uint8Array(buffer)], {
				type: file.type,
			});

			// get url from blob
			const url = window.URL.createObjectURL(blob);
			setUploadURL(url);
		};
		reader.readAsArrayBuffer(file);
	};

	return (
		<div className="create-post-form">
			<Box className="form-container" component="form">
				<div className="flair-container">
					<h3 className="flair-header">Post Flair:</h3>
					<div className="flair-choice">
						<h4
							id="discussion"
							className={
								postFlair !== null && postFlair === "discussion"
									? `filter-flair ${theme}-bg discussion active`
									: `filter-flair ${theme}-bg discussion ${theme}-bg-hover`
							}
							onClick={() => setPostFlair("discussion")}
						>
							Discussion
						</h4>
						<h4
							id="achievements"
							className={
								postFlair !== null &&
								postFlair === "achievements"
									? `filter-flair ${theme}-bg achievements active`
									: `filter-flair ${theme}-bg achievements ${theme}-bg-hover`
							}
							onClick={() => setPostFlair("achievements")}
						>
							Achievements
						</h4>
						<h4
							id="question"
							className={
								postFlair !== null && postFlair === "question"
									? `filter-flair ${theme}-bg question active`
									: `filter-flair ${theme}-bg question ${theme}-bg-hover`
							}
							onClick={() => setPostFlair("question")}
						>
							Question
						</h4>
						<h4
							id="gameplay"
							className={
								postFlair !== null && postFlair === "gameplay"
									? `filter-flair ${theme}-bg gameplay active`
									: `filter-flair ${theme}-bg gameplay ${theme}-bg-hover`
							}
							onClick={() => setPostFlair("gameplay")}
						>
							Gameplay
						</h4>
					</div>
				</div>
				<TextField
					className="form-text-field"
					autoComplete="off"
					placeholder={"Title"}
					value={postTitle}
					onChange={(event) => setPostTitle(event.target.value)}
				/>
				<TextField
					className="form-text-field"
					multiline
					rows={10}
					autoComplete="off"
					placeholder={"Content (Optional)"}
					value={postContent}
					onChange={(event) => setPostContent(event.target.value)}
				/>
				<OutlinedInput
					type={showSecretKey ? "text" : "password"}
					className="form-text-field"
					placeholder={"Secret Key"}
					value={secretKey}
					variant={"outlined"}
					autoComplete="off"
					onChange={(event) => setSecretKey(event.target.value)}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => {
									setShowSecretKey(!showSecretKey);
								}}
								edge="end"
							>
								{showSecretKey ? (
									<VisibilityOff />
								) : (
									<Visibility />
								)}
							</IconButton>
						</InputAdornment>
					}
				/>
				<Box sx={{ width: "100%", typography: "body1" }}>
					<TabContext value={tabVal}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<TabList onChange={handleChange}>
								<Tab
									label="Image/Video (Optional)"
									value="1"
									className="upload-tab-header"
								/>
								<Tab
									label="Preview"
									value="2"
									className="upload-tab-header"
								/>
							</TabList>
						</Box>
						<TabPanel value="1" sx={{ p: 0.5 }}>
							<div className="url-tab-container">
								<FormControl sx={{ m: 1, minWidth: 150 }}>
									<Select
										value={urlType}
										onChange={handleSelectChange}
									>
										<MenuItem value={"image"}>
											Image URL
										</MenuItem>
										<MenuItem value={"video"}>
											Video URL
										</MenuItem>
										<MenuItem value={"upload"}>
											Upload Image
										</MenuItem>
									</Select>
								</FormControl>
								{urlType === "upload" ? (
									<>
										<p className="selected-file">
											Selected Image:{" "}
											{filename === ""
												? "No file chosen"
												: filename}
										</p>
										<label
											htmlFor="file"
											className={`${theme}-bg upload-btn ${theme}-bg-hover`}
										>
											Select Image
										</label>
										<input
											className="file-input"
											type="file"
											id="file"
											onChange={handleUpload}
											accept="image/*"
										/>
									</>
								) : (
									<TextField
										className="form-text-field"
										placeholder={
											"Image or Video URL (Optional)"
										}
										value={postURL}
										autoComplete="off"
										onChange={(event) =>
											setPostURL(event.target.value)
										}
									/>
								)}
							</div>
						</TabPanel>
						<TabPanel value="2" sx={{ p: 1.5 }}>
							{postURL.replace(/\s/g, "") === "" &&
							uploadURL.replace(/\s/g, "") === "" ? (
								<p className="no-url-message">
									There is nothing to be previewed currently.
									Please input a url or upload an image in the
									previous tab.
								</p>
							) : urlType === "image" ? (
								<img
									src={postURL}
									alt="There was an issue with displaying the previewed image. Please input a different URL if this problem persists."
									width={"100%"}
									height={"auto"}
								/>
							) : urlType === "video" ? (
								// <ReactPlayer url={postURL} controls width={'100%'} />
								<div className="player-wrapper">
									<ReactPlayer
										url={postURL}
										className="react-player"
										width="100%"
										height="100%"
										controls
									/>
								</div>
							) : urlType === "upload" &&
							  uploadFile !== null &&
							  uploadFile.type.includes("image") ? (
								<img
									src={uploadURL}
									alt="There was an issue with displaying the previewed image."
									width={"100%"}
									height={"auto"}
								/>
							) : (
								""
							)}
						</TabPanel>
					</TabContext>
				</Box>
				<button
					className={`${theme}-bg create-post-btn ${theme}-bg-hover`}
					type="submit"
					onClick={handleCreatePost}
				>
					Create Post
				</button>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					fullWidth
					maxWidth="xs"
				>
					{loading ? (
						<>
							<DialogTitle
								id="alert-dialog-title"
								className="dialog-title-loading"
							>
								Loading
							</DialogTitle>
							<DialogContent>
								<div className="spinner-container">
									<l-dot-spinner
										size="50"
										speed="0.9"
										color={"gray"}
									></l-dot-spinner>
								</div>
							</DialogContent>
						</>
					) : error ? (
						<>
							<DialogTitle
								id="alert-dialog-title"
								className="dialog-title"
							>
								Error!
								<Icon
									className={`${theme} close-icon`}
									icon="mdi:close"
									width={"2rem"}
									height={"2rem"}
									onClick={handleClose}
								/>
							</DialogTitle>
							<DialogContent dividers>
								<DialogContentText
									id="alert-dialog-description"
									className="dialog-content"
								>
									{message}
								</DialogContentText>
							</DialogContent>
						</>
					) : success ? (
						<>
							<DialogTitle
								id="alert-dialog-title"
								className="dialog-title"
							>
								Success!
							</DialogTitle>
							<DialogContent dividers>
								<DialogContentText
									id="alert-dialog-description"
									className="dialog-content"
								>
									Post was created successfully! View the
									newly created post or return home.
								</DialogContentText>
							</DialogContent>
							<DialogActions className="dialog-actions">
								<div className="dialog-btns-container">
									<div
										className={`${theme}-bg dialog-btns ${theme}-bg-hover`}
										onClick={() => navigate("/")}
									>
										Back to Home
									</div>
									<div
										className={`${theme}-bg dialog-btns ${theme}-bg-hover`}
										onClick={() =>
											navigate(`/post/${postID}`)
										}
									>
										View Post
									</div>
								</div>
							</DialogActions>
						</>
					) : (
						""
					)}
				</Dialog>
			</Box>
		</div>
	);
};

export default CreatePost;
