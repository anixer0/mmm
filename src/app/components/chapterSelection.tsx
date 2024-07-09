"use client";
import {
	MangareaderInfo,
	FlamecomicsInfo,
	Mangapill,
	Mangaworld,
} from "./types";
import { imageFetcher } from "./request";
import ImageDisplay from "./imagesDisplay";

import { SetStateAction, useState } from "react";

const ChapterSelector = ({
	data,
	provider,
}: {
	data: MangareaderInfo | FlamecomicsInfo | Mangapill | Mangaworld;
	provider: string;
}) => {
	const [showImages, setImages] = useState<JSX.Element>(<></>);
	const [loading, setLoading] = useState<JSX.Element>(<></>);
	const [nextId, setNextId] = useState<string | undefined>("");

	const imagesLoading = (message: string) => (
		<div className="toast toast-end">
			<div className="alert alert-info">
				<span>{message}</span>
			</div>
		</div>
	);

	const imageLoaded = (message: string) => (
		<div className="toast toast-end">
			<div className="alert alert-success">
				<span>{message}</span>
			</div>
		</div>
	);

	const getImages = async (id: string) => {
		var loading = (
			<span className="loading loading-infinity loading-lg mt-2"></span>
		);
		setNextId((Number(nextId) + 1).toString());
		setImages(loading);
		setLoading(imagesLoading(`Loading Images.`));
		const data = await imageFetcher(id, provider);
		const format = await ImageDisplay(data, provider);
		setImages(format);
		setLoading(imageLoaded("Images loaded successfully."));
		setTimeout(function () {
			setLoading(<></>);
		}, 2000);
	};

	return (
		<div>
			<select
				className="select select-bordered w-full"
				onChange={async (event) => {
					const selectedKey: SetStateAction<string> | undefined =
						event.target.options[event.target.selectedIndex].dataset
							.key;
					setNextId(selectedKey);
					getImages(event.target.value);
				}}
			>
				{data.results.chapters &&
					data.results.chapters.map((item, index) => (
						<option value={item.id} data-key={index} key={index}>
							{item.title}
						</option>
					))}
			</select>
			<div className="flex items-center flex-col justify-center">
				{showImages}
				<button
					className="btn btn-neutral btn-sm mt-2"
					onClick={() => {
						console.log(Number(nextId) + 1);
						getImages(data.results.chapters[Number(nextId) + 1].id);
					}}
				>
					Next Chapter
				</button>
			</div>
			{loading}
		</div>
	);
};

export default ChapterSelector;
