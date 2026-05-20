import React, { PropsWithChildren, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Footer from '../footer/footer';
import HeaderNavbar from '../header/header';
import { SidebarDesktop } from '../sidebars';
import { headerNavbarOptions } from 'const';
import cmsSidebarNavigation from 'const/sideBarNavigation';
import { NavigationOptions } from 'interfaces';
import { filterNavigationOptionsByRolesOrPermissions } from 'utils/options';
import { Button, Typography } from 'components/common';
import { Can } from 'components/auth/Can';
import { CypressI } from 'interfaces/cypress';

export interface Layout_Props {
	title?: string;
	classNameTitle?: string;

	withHeader?: boolean;
	customHeader?: React.ReactNode;

	withFooter?: boolean;
	customFooter?: React.ReactNode;

	withSidebar?: boolean;
	customSidebar?: React.ReactNode;

	buttonTitle?: string;
	classNameButton?: string;
	hrefButton?: string;
	onClickButton?: () => void;

	classNameChildren?: string;
	classNameLayout?: string;

	allowedPermissions?: string[];
	allowedRoles?: string[];
}

/**
 * This is the main layout component to render a page
 * It has a default behaviour/style but it also considers when a custom component is meant to be rendered
 *
 * @param props they will handle the behaviour of the layout and the styles
 * @returns JSX element for the layout container
 */
export const Layout: React.FC<PropsWithChildren<Layout_Props & CypressI>> = ({
	dataCY,
	title,
	classNameTitle,

	withHeader = true,
	customHeader = undefined,

	withFooter = false,
	customFooter = undefined,

	withSidebar = true,
	customSidebar = undefined,

	buttonTitle,
	classNameButton = undefined,
	hrefButton,
	onClickButton,

	children,
	classNameChildren,
	classNameLayout,

	allowedPermissions,
	allowedRoles,
}) => {
	const { data: session } = useSession();
	const logoUrl =
		'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUSFRgSEhIYGRgaGBoaGRgcGRocGBgYGhoZHBkYHBocIS4lHR4rHxgYJjgmKy8xNTc1HCQ7QDszPy40NTEBDAwMBgYGEAYGEDEdFh0xMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMf/AABEIAOcA2gMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABwgEBQYDAgH/xABJEAABAwIBBwYHDQcEAwAAAAABAAIDBBEFBgcSITFBURMiYYGRoRRCUlNxotIVFiMyYnJzgpKxssHRJDNDVHSTsxc0o8JE4fH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmRcfnWo+VwuoA2sDHj6j2k+rpLsFgY3SianljIvpxvb2tKCohReksZa4tO1pIPpBsvNAREQEREBERAREQEREBdPkNks/EqlsYuI22dK/yWcB8o7B2rR4dQyVEjYYmlz3uDWgcSrO5E5Msw6mbC2xeedI+2tzzt6hsHQg3dJTNiY2NjdFrGhrRwAFgtHlrlPHhlOZna3nmxs3ufY9w2krb4niEdNE+eZwaxjS5x6BwG87rKseWeVEmJVDpn3DBqjZ5DL6vrHegwq3H6mV7pX1Emk5xcbPcBrOwAHUFje6tR/MS/3H/qsNEGZ7qT/zEv8Acd+q/PdOfz8n23/qsREGX7pT+fk+279U905/Pyfbf+qxEQZrcVnH/kS/3HfqusyYzl1lG4CSR08WoFjzdwHyXnXf0rhkQW2yexyGvhbUU7rtO0eM129rhuIW0Vbs1WUrqKsbG5x5KYhjxuDtjHdRNutWRugIURBVXLnD/Bq+oitYCRxHSHc4HvXPqT8+mHaFZHUAapYgD86M2PqlvYowQEREBERAREQESyICIlkHYZuspoMOqDLPBphw0Q8HnRjeWt33/JWIwfGqesjEtPK17N9jrHEOG5VHWXR18sOlyUj2aQLXaLiNJp1EG21B3mdfLbw2Q0sDvgI3a3D+I8b/AJo3KOERAREQEREBERAREQesEmi5ruDgew3VvKJ+lGx19rGntAVPlaTAK0mlpzfbDEe1jUHTIiII8z04Ty9ByrRd0Lw/6h5rvvB6lXgq32KUTaiGSF2x7HMPWLKpVfSuhkfE8a2Pcw+lpIQYyIiAiIgL2p4HSODGNLnOIDWgXJJ3ALxCnzNNkWKaMVs7QZpG3YD/AA2HZ9Y8UGoyPzRAtbLiLiCdYgadnz3cegKTcOyZo6YAQ0sTbb9Bpd9o61uEQY8lHG8WdGxw4FjSOwhcvjubqgqwfgGxOPjxgNN/QNRXYIgrNlpkDUYa7TPwkBPNlaNnAPHinp2LjiFcOrpmSsdHI0OY4EOaRcEFVqziZKOw2pLWgmF93RO6N7T0tPdZByKIiAiIgLsM32Rvuq+VhkLGxxg6QF+e51mgjhYPPUFx6sHmSwzkqF0xGuaQu+q3mt/M9aCPsZzSV8FzEGTt+QdF/wBh35Eria7DJoCWzQyRkbnNLfv2q3yivPpigZTx0wtpSP0jsuGs/wDZCCCUQogKfsnMRApKYX2QRDsjaoBUyYHL+zQfQx/gagmZERAVec82B+D1vLtHMqG6fQJG6nj8J6yrDLic62BeF0L3Nbd8XwjLbbNHOHZdBWtEKICIiDf5EYT4ZXQQEc0vDn/MbzndoFutWpY0AAAWA1AcAq95kGA4iSfFgkI9N2D7iVYZAREQEREBcPnZwYVNBI/Ru+H4Rp32Hxh2EruFr8eYHU07TsMMgP2HIKilERAREQfcbC4ho2kgD0nUFbTJ3DxS00MAFtBjQfnW1991W7N7hnhOIU0ZF2h4e75rOd94AVpEBVuzuYt4RiMjQbshAjbr3gXefTpEj6oVhMZrhTwSTuNgxjndg1KpNXUGR75HbXuc4+lxJ/NB4IiIClrBoz4PD9FH+AKJVNeAs/ZoNX8GL8DUEvBwOxfqjPN1lcH1FRh0zue2aYwk+M0PdeO/EbQOHoUmIC+XC+oi/Rx6F9Igq1l7k8cPrJIQOYTpxndoOOodWzqXNKw+eHJs1dJy8bbyQXfqGtzPHHVt6lXhAREQdrmkrxBiUOlqDw+O/S4XHeArKhU7pZ3RvbIw2cxwc08C03HeFafJHKBmIUzKhh12Ae3e14+MD96DeoiICIiAtBlzXinoKmQn+E5o6XPGiAO1b9Qnnsyna9zcPidfRIfMQdWl4rPSBrPUgiFERAREQS7mGwvSknqyNTGiNp6Xc53cGqbVxGaPDeQw6MkWdITIfQ74vcF26COM9mL8jQiBp507w3p0G853V8Udar4VImerFuWrhCDdsDAz67uc7/r2KO0BERAU+5OM/ZKb6CL/ABtUBKxeTDP2Ol/p4f8AG1BB+KVb4K+aWNxa9lTI5p4ESOVj8jcomYjTMnZYOtovb5LxtHo3hVoyl/3lT/US/wCRy3+bbKo4dVAvPwMlmSDcPJf0EHuJQWYRfEcgcA5puCAQRsIK+0Hw9gcCCLgixHEHaFWjORkx7nVbmsHwUl3x8ACdbeo91lZpcvl5ky3EqV0VrSN50Tt4eBs9BFwR+iCrqL2qYHRvcx7S1zSWuB2gjUV4oC6bIrK6bDJuUj50brCSMnU4cRwcNx6lzKILX5OZS0+IMD6eQE+Mw6ntO8Fq3ap9R1skLg+KRzHDY5ri09y7TDM6+JQgNfIyUDzjBpW4aTC0n0m6Cxq+XOAFybDioFlz0VpFmQQNPEh7u7SC5fG8uK+sBbNUu0D4jAGN9FmgE9ZKCWMv85kdM11PRvD5yCC8a2x9e93QFA08zpHF73FznElzjrJJ2kryJRAREQFkUdM6WRkTPjPe1jfnOIaO8rHXb5pMM8IxGNxHNiBkPpAs3vN+pBYrD6VsMbIm/FYxrB9UAL7qpgxj5Dsa0u7BdeyEIKiY1WuqKiWZ99J73ON9oudQ7LLAVscVyXo6sftFLG8+Vo2d9ptj3risVzN0clzTySRHySdNnrc7vKCA0UjYtmhrormEsmHBp0Xdjv1XFYngtRSm1RTyR67XcwhpPQ7YeooNcrKZMU/7HS/08P8Ajaq1qzGThHglN9BF/jagr3lN/vKr+om/yOWsauixDCpqvEKmGnjc95qJtQ3fCO1k7AFMGQ+bCKj0Z6rRln2gbY2HoB+MekoMvNI+r8CDKuNzWtNoXO1OdHwLdoAOwncu8X4Av1AREQQ5nlyNLr4jTt1gATtA3DZJ+RUMK400bXtLHAFrgQQdhB1EKuOcrIx2HTl8YvTyG7D5BO1h4dHQg4dERAREQEREBERAREQFNuYXDLRz1RHxnCNp6Gi7u8hQkrRZt8M8Fw6njIs5zOUdx0nkut1AgdSDqFr6XGKeV74o52OkYSHsDhptI4t2rwyqxdtFSzVLvEYdEcXnU0dpCqo+peXmXSdplxcXA2dpEkk3Gw3KC4SKs+C5yMQpbNE/KNHiyc71tq7fC89jLAVVI4He6JwPqut96CYV5yRtcNFzQ4HaCAQeorkcOzl4ZPYCp5M8JGlnVfZ3rpqTFIJReKZjx8l4P5oNDi2QGHVNy+lY1x8ZnMPq6ltaLBmQxshYX6MbGsbdwvZoDRfqC2qXQa3DMGgpi8wxhrpHse93jOc4kkk+krZIiAiIgIiICwMZwqKrhfBOwOY8WPEHcQdxHFZ6IKr5Y5LTYZOYpBpMNzHJbU9v5HiFzpCthlRk7DiEDoJht1tePjMduc0/lvVasqcnZsOnMEzeljvFe3yh+aDSIlkQEREBERAREQbPJ3DzVVMMAF9ORoPzb3d3Aq2kTA1oaNjQAPQBZV/zJYbytcZSLiGMu9Dnc1v5qwaDDxLDoqlhinjbIw7WuFxcbDr3rgcZzPUUt3U73wO4A6bOx2sdqkpEFfMVzQ10VzC6OZo4HRd9l36ri8TwKppiRPTyMtvLTbtGpW3XxJG14s5ocOBFx3oKcBekUrmG7XFp4gkHuVocTyFw6puZKSO58Zl2O7WEXXI4lmXpn66eeSPodZw7bAoIiosqq6H93VzN+uT991OOB41O+mge+Zxc6GNzjq1ksaSdnFcDiOZusZcwyRyDhctPepBwbAJ46eGN8NnNija4XG1rADv4hB3iIiAl15TStY0ve4NaBcuJsABvKhrLzOoX6VNhxIbrDp97uOgOG3WUHWZd5xocPDoYS2So2aIN2xni8jfv0VGGS+cmqpql01Q90rJD8IwnUODmDxbcBtXCveSSSSSdZJ2knaSvi6C3mE4nFVRMngeHMeLgg9oPAg6rLOVYshcs5cMluAXwuPwkd9vym31B1u2ysdg2KxVcTaineHMcNR3g72kbiOCDPWlyoycgxGEwzt6WvHxmO3Oafy3rdIgqplbkxPhsximaS062PA5r28QePELQEK3GOYLDWxOgqGBzXdrT5TTuKrvlvkNPhjy6xfATzZQNgOxrx4ru4oOPRCiAiIgIiIOlySyxqMMLzThhD7aYe299HZYggjapGwzPWw2FTSubxcx2kOw2UKJdBZzDM4+Gz2tVNYTuk5ne7V3rqYahsgDmPa5p2FrgQfQQqdXWXQ4jNAdKGV7Dxa4tv6bbUFv0XI5s5KmShZNVyOe+Ql7S61wzYzZtuBfrXVyPDQXE2AFyeAG1B9ouLos52GSm3hOgb+O1zR27F0lFjVPMLxVEb/mvaUGwRfgK/UBazHscgoYjNUvDWjYPGceDRvK0WW+XcGGtLbh85HNiB2dLj4oVfcoMoKivkMtTIXHxW7GMHBrd33oN7lxnAnxJxYwmOn3Rg63dLzv9GxcUiICIiBddVkRljNhkmk3nROPwkd9RHlN4OC5VAgt1guMQ1kTZ6d4cxw6weDhuPQtgqzZusfqqWqZHStMjZHBrodzx5Q8kjWb9qsww6tlkH6vGqpmSsdHIxrmOFnNcLgg7iF7IggrLvNY+DSqKAF8esui2vYN+j5Q6NqixzSLgi1tRVyCFH+W+bSnrtKaACGfaXD4knz27j8odaCuqLaY7gVRQyGGpjLHbj4rhxa7YQtXZAREQEREBbLAMNdVVEVO3a94b1X1nsutapWzGYLylRJWPHNiboN4co/aepo9ZBN1JTtjYyNos1jQ0DoAsuVzoY14JQSlps+Qcm3jz9Tj2XXYKBs+GNcrVMpGu5sLdJw3abwCB6Q232kEXL7jeWm4JB4g2K+EQbugyrroP3VXK3o0i4etdbf8A1OxT+a9Vv6LjUQZ+NSF1RM5xJJkfck3J5x3lYCy8W/fy/SP/ABlYiAiIgIiIC96SlfK9scbS57iA1o1kkr5ghc9wYxpLnGwaBcknYAFYTNpkG3D2CoqGg1Lx6RE07Gj5XEoMzN5kOzDY9OQB1Q8DTdt0R5DTw4neu1CIgIiICJdEGvxjCIKuMxVMbXtO4jWDxadoPSoVyyzUTU+lLQ3mj2lm2Ro6PKHep6RBTiSMtJa4EEaiDqIPAgr4VocqshqTEQTJHoSbpWAB9+nc7rUKZU5uKyhu8N5aLc9gNwPlM2t7wg4lF+2X4gBWfzcYL4HQxMIs9w5R/HSdrseqygLIXBjW10EFubpB7/mM5zu21utWnAtsQeNZUtiY+R5s1jS4+gC6qZjmIOqqiWocbl73O6idQ7LKec8uNeDUJiaefO7QHQwa3nssPrKuxQEREBERBl4t+/l+kf8AjKxFl4t+/l+kf+MrEQEREBfcbC4gAXJNgBtJOwL5AU3ZrM3vJaNdWN55F4oz4l/HcPKtsG66DNzXZACkAq6poM7hzGbRE07z8s9yk5EQEREBCUUS5084PJaVDRv55FpZB4gO1jT5XHhdBhZ0M4p0jR0MhGifhJWneD8RhHeepeeRmdxzdGHERpN2Cdo5w+e3eOkdiiAlLoLgYfiEdQwSQva9h2OabhZSqXgOUNTQv16aZzDvbta7oc06ipfyXzvwy2jrm8k/ZyjbmM9JG1qCVV+EXWPR1kczQ+KRr2nY5pBHcslBxWVObiirrvDORlPjsAFz8puw/eogylza1tFdwZy0Y8eMEm3SzaO9WUQhBEOYvBNFk1Y9utx5Nl9wbreaejXq6lLy844msFmtDRe9gLC52nUk2lonQtpWOjfZe2rvQV6zy4z4RXGJpuyBugPnnW/8AIdSj5djlXkXiMEkk00Dnh7i4yMu9vOJOsDWOsLkHC2ooPlERAREQZeLfv5fpH/jKxFl4t+/l+kf+MrEQECLIop+TeyTRa7RcHaLhdrrG9iN4QSzmrzfaWjX1jOaLOhjcNvCRwO7gOtTSuSyJy3gxJmi2zJmjnRE97fKautQEREBChXAZysvG4ewwQEOqXjVwjafGd08Agwc5+cAUjXUlK4Gdws9w1iJp/wC9t25QK95JJJJJNyTrJJ2k8SvqeZz3F73FznElzibkk7SvJAREQEREGywnGqijfp00z4z8k6j6WnUesKS8AzzSNsytgDx5bOa70lp1diiJEFosEy8oKywjqWMcfEeQxxPAaW3qXTtcDrBuqbKyuafDnQYbEZCS6TSksSTotcbMAvsGiAbdKDtURRhjWd2OlnkpzSPeY3FukJAAbb7aKCT1pMWyVoqrXPSxuPlaIDvtCxUe/wCt8X8i/wDuN9lSpQVPKxslAtpsa6222kAbII8xLM3RP1wySxHhcPHeL2XMV2ZWobcw1Ub+hzS0911OaIK4VOajE2bImP8AmvH52WB/pzin8i/7UftKzyIKj5QUzoqmeN4s5ssgI+sfy1rWqYc9GSTg73Rhbdps2YAbDsa89G4n0KHiEBERBkUdU+F7ZYnlr2m7XA2IIU6ZAZzG1WjTVhDJtjX7GSey7o/+KA19NNtfBBcgFFBeb7Oe6DRpq9xdHqDZTrdGODvKb07QpGyyy1goKcSsc173t+BaDcO4ONvFCDxzh5asw2LRZZ1Q8EMbub8t3QOG9Vxrat8z3SyPLnuJLnHaSV6YpiMlVI6ed5e9xuSfuHAdCw0BERAREQEREBESyDd5I4M6uq4qYDU5wLzwY3W49mrrVqqeJsbWsaLNa0NA4AAABRhmUyZ5GF1dI3nyjRjvujG131j3AKVEHlUTNja6R5s1rS4k7AGi5Pcqj4tWGomkmPjvc+3AOJIHULBTrnlykFPS+CMd8JOLEbxH43bs61X0oCtzk9/tYPomfhCqMrc5Pf7WD6Jn4Qg2KiDOtlfW0NUyOmm0GOjDraLTrmbm5Cl9QPn4b+1wnjF9zkHOOzk4mf8Ay3fZb+ilfB62ukp4ZDUOu6KNx1Da5gJ3dKhbJPJ+TEKhkDAbEgvduawbST3BWkp6RkbWsDdTWho9AFh9yD0mia5pa8AtIsQRcEHaCN6iTK3NAHuMuHuDb6zC480fMduHQURBHFXkTXROLHwC44SRkfiXh706zzHrx+0iIHvTrPMevH7S/PepWeY9eP2kRA96tZ5j14/aX07JqsNgYibCwvIzUOA52pEQfHvVq/M+vH7S/PevV+Z9eP2kRA969X5n14/aT3sVfmfXj9pfiIHvYq/M+vH7Se9mq8z67PaREH572qrzPrx+0nvaqvM+uz2kRA97VV5n12e0t7kfkRNVVUcczNGMc950mnmNtcAAk3NwERBZKCFsbWsa0Na0ANA2AAWAXlXTujjfI1heWtJDQQCTu1kgBEQV6yhyZxaunfUzU3OedQ5WKzW+K0c/YAtQ7IXEBtpv+SL21+Ig8nZHVo20/wDyR+0rN4EwtpoQ4WIijFukNHBEQbBcBl5kG7FKiGQyhkcbC1+q7iS69gNmzeiIOmycybp8Pj5KmZo3+M463uPFx3+hblEQf//Z';

	const [sideBarOptions, setSideBarOptions] = useState<NavigationOptions[]>([]);
	const [showSidebar, setShowSidebar] = React.useState<boolean>(false);

	useEffect(() => {
		const filteredOptions = filterNavigationOptionsByRolesOrPermissions(
			cmsSidebarNavigation,
			session?.user
		);
		setSideBarOptions(filteredOptions);
	}, [session]);

	return (
		<div
			data-cy={`${dataCY}-layout`}
			className={clsx('w-full h-screen overflow-hidden', classNameLayout)}
		>
			{/* Header */}
			{withHeader && !customHeader && (
				<HeaderNavbar
					dataCY={`${dataCY}-header`}
					navBarOptions={headerNavbarOptions}
					logoUrl={logoUrl}
					showSidebar={showSidebar}
					setShowSidebar={setShowSidebar}
				/>
			)}
			{withHeader && customHeader && <>{customHeader}</>}

			{/* Content of the layout */}
			<div className={clsx('flex h-screen overflow-hidden', classNameChildren)}>
				{/* Sidebar */}
				{withSidebar && !customSidebar && (
					<SidebarDesktop
						dataCY={`${dataCY}-sidebar`}
						itemOptions={sideBarOptions}
						showSidebar={showSidebar}
					/>
				)}
				{withSidebar && customSidebar && <>{customSidebar}</>}

				{/* Right container for actual page content */}
				<div
					className={clsx({
						'relative w-full mb-10 overflow-y-scroll scroll-custom':
							withSidebar,
					})}
				>
					{/* Content - Children */}
					<main
						className={clsx({
							'relative w-full px-9 md:px-16 py-10 mb-10': withSidebar,
							'-z-10': showSidebar,
						})}
					>
						<div className="flex gap-x-2 justify-between items-center mb-10">
							{title && (
								<Typography
									type="custom-h1"
									text={title}
									className={clsx(
										'text-md lg:text-xl font-bold text-gray-800',
										classNameTitle
									)}
								/>
							)}
							{buttonTitle && (
								<Can
									allowedPermissions={allowedPermissions}
									allowedRoles={allowedRoles}
								>
									<Button
										label={buttonTitle}
										decoration="fill"
										size="fit"
										className={classNameButton}
										onClick={onClickButton}
										href={hrefButton}
									/>
								</Can>
							)}
						</div>

						{children}
					</main>

					{/* Footer */}
					{withFooter && !customFooter && (
						<Footer
							dataCY={`${dataCY}-footer`}
							companyName="Shokworks"
							rightsYear="2023"
						/>
					)}
					{withFooter && customFooter && <>{customFooter}</>}
				</div>
			</div>
		</div>
	);
};
