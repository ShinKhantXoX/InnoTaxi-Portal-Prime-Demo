import svgPaths from "./svg-6msdgbplsy";
import imgImage from "figma:asset/8d8e8db1766303df703d501125f10b1d295cf64c.png";

function Image() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[32px]" data-name="Image">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgImage} />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[93.461px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-0 not-italic text-[#e53935] text-[11px] top-[0.5px] tracking-[0.88px] uppercase whitespace-nowrap">Admin Portal</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[32px] items-center left-[33px] top-[33px] w-[374px]" data-name="Container">
      <Image />
      <Paragraph />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[36px] left-[33px] top-[77px] w-[374px]" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[36px] left-0 not-italic text-[#0f172a] text-[24px] top-[-1px] tracking-[-0.48px] whitespace-nowrap">Welcome back</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[20.25px] left-[33px] top-[117px] w-[374px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20.25px] left-0 not-italic text-[#64748b] text-[13.5px] top-[-0.5px] tracking-[-0.135px] whitespace-nowrap">Sign in to the InnoTaxi Service admin dashboard</p>
    </div>
  );
}

function EmailInput() {
  return <div className="absolute bg-[#f8fafc] border border-[#cbd5e1] border-solid h-[52px] left-0 rounded-[10px] top-0 w-[374px]" data-name="Email Input" />;
}

function Label() {
  return (
    <div className="absolute h-[21px] left-[40px] top-[15.5px] w-[95.188px]" data-name="Label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 whitespace-nowrap">Email Address</p>
    </div>
  );
}

function LoginForm() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="LoginForm">
      <div className="absolute inset-[16.67%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5.63%_-4.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.534 11.866">
            <path d={svgPaths.p3925e000} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-[8.33%] right-[8.33%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-12.86%_-4.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.5341 5.86705">
            <path d={svgPaths.p399d5500} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[12px] size-[16px] top-[18px]" data-name="Text">
      <LoginForm />
    </div>
  );
}

function PInputText() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="PInputText">
      <EmailInput />
      <Label />
      <Text />
    </div>
  );
}

function PasswordInput() {
  return <div className="absolute bg-[#f8fafc] border border-[#cbd5e1] border-solid h-[52px] left-0 rounded-[10px] top-0 w-[374px]" data-name="Password Input" />;
}

function Label1() {
  return (
    <div className="absolute h-[21px] left-[40px] top-[15.5px] w-[65.594px]" data-name="Label">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 whitespace-nowrap">Password</p>
    </div>
  );
}

function LoginForm1() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="LoginForm">
      <div className="absolute inset-[45.83%_20.84%_16.67%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-10%_-6.43%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.533 7.2">
            <path d={svgPaths.p2fb788c0} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.66%_33.33%_54.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-12.86%_-11.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.534 5.867">
            <path d={svgPaths.p1d26b400} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[12px] size-[16px] top-[18px]" data-name="Text">
      <LoginForm1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[2px] size-[16px] top-[2px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function LoginForm2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="LoginForm">
      <Icon />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[24.5px] items-start left-[342px] top-[13.75px] w-[20px]" data-name="Text">
      <LoginForm2 />
    </div>
  );
}

function PInputText1() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="PInputText">
      <PasswordInput />
      <Label1 />
      <Text1 />
      <Text2 />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[18px] relative shrink-0 w-[102.703px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[51.5px] not-italic text-[#e53935] text-[12px] text-center top-[0.5px] whitespace-nowrap">Forgot password?</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[18px] items-center justify-end relative shrink-0 w-full" data-name="Container">
      <Button />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[76px] items-start relative shrink-0 w-full" data-name="Container">
      <PInputText1 />
      <Container6 />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[18px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border-2 border-[#cbd5e1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[188.313px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-px whitespace-nowrap">Keep me signed in for 30 days</p>
      </div>
    </div>
  );
}

function PCheckbox() {
  return (
    <div className="content-stretch flex gap-[10px] h-[19.5px] items-center relative shrink-0 w-full" data-name="PCheckbox">
      <Checkbox />
      <Text3 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[205.81px] size-[16px] top-[15px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d405500} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PButton() {
  return (
    <div className="bg-[#e53935] h-[46px] relative rounded-[10px] shadow-[0px_1px_3px_0px_rgba(229,57,53,0.3)] shrink-0 w-full" data-name="PButton">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[175.18px] not-italic text-[14px] text-center text-white top-[12.5px] whitespace-nowrap">Sign In</p>
      <Icon1 />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[253.5px] items-start relative shrink-0 w-full" data-name="Form">
      <PInputText />
      <Container5 />
      <PCheckbox />
      <PButton />
    </div>
  );
}

function Container7() {
  return <div className="bg-[#e2e8f0] flex-[1_0_0] h-px min-h-px min-w-px" data-name="Container" />;
}

function Text4() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[90.039px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-0 not-italic text-[#94a3b8] text-[11px] top-[0.5px] tracking-[0.88px] uppercase whitespace-nowrap">Demo Access</p>
      </div>
    </div>
  );
}

function Container8() {
  return <div className="bg-[#e2e8f0] flex-[1_0_0] h-px min-h-px min-w-px" data-name="Container" />;
}

function PDivider() {
  return (
    <div className="content-stretch flex gap-[12px] h-[16.5px] items-center pr-[-0.008px] relative shrink-0 w-full" data-name="PDivider">
      <Container7 />
      <Text4 />
      <Container8 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_1_27)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 9.33333V7" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 4.66667H7.00583" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_1_27">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#e53935] relative rounded-[8px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#e53935] text-[12px] top-[0.5px] tracking-[0.12px] whitespace-nowrap">Demo Credentials</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[24px] relative shrink-0 w-[137.18px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container12 />
        <Text5 />
      </div>
    </div>
  );
}

function PButton1() {
  return (
    <div className="bg-[#fef2f2] h-[28px] relative rounded-[10px] shrink-0 w-[68.422px]" data-name="PButton">
      <div aria-hidden="true" className="absolute border border-[#fecaca] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] not-italic relative shrink-0 text-[#e53935] text-[11px] text-center whitespace-nowrap">Auto Fill</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <PButton1 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[58px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[#94a3b8] text-[11px] top-[0.5px] whitespace-nowrap">Email</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[18px] relative shrink-0 w-[130.047px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Menlo:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#991b1b] text-[12px] top-0 whitespace-nowrap">admin@innotaxi.com</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center relative shrink-0 w-full" data-name="Container">
      <Text6 />
      <Text7 />
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[58px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[#94a3b8] text-[11px] top-[0.5px] whitespace-nowrap">Password</p>
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[18px] relative shrink-0 w-[57.797px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Menlo:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#991b1b] text-[12px] top-0 whitespace-nowrap">admin123</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center relative shrink-0 w-full" data-name="Container">
      <Text8 />
      <Text9 />
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] h-[62px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(254,202,202,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-px pt-[11px] px-[13px] relative size-full">
        <Container14 />
        <Container15 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#fef2f2] h-[136px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(254,202,202,0.6)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <Container10 />
        <Container13 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] h-[446px] items-start left-[33px] top-[165.25px] w-[374px]" data-name="Container">
      <Form />
      <PDivider />
      <Container9 />
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-white h-[644.25px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <Container3 />
      <Heading1 />
      <Paragraph1 />
      <Container4 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[0] left-[220.13px] not-italic text-[#94a3b8] text-[0px] text-[11px] text-center top-[0.5px] whitespace-nowrap">
        <span className="leading-[16.5px]">{`Styled with `}</span>
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] text-[#64748b]">PrimeVue</span>
        <span className="leading-[16.5px]">{` Aura Theme · Built with React + Tailwind`}</span>
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[680.75px] relative shrink-0 w-[440px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[20px] items-start relative size-full">
        <Container2 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#f1f5f9] content-stretch flex h-[1118px] items-center justify-center left-[744.48px] pr-[0.008px] top-0 w-[806.523px]" data-name="Container">
      <Container1 />
    </div>
  );
}

function Container18() {
  return <div className="absolute border-50 border-solid border-white left-[324.48px] rounded-[16777200px] size-[360px] top-[-80px]" data-name="Container" />;
}

function Container19() {
  return <div className="absolute border-50 border-solid border-white left-[-80px] rounded-[16777200px] size-[480px] top-[738px]" data-name="Container" />;
}

function Container20() {
  return <div className="absolute border-30 border-solid border-white left-[321.14px] rounded-[16777200px] size-[200px] top-[447.2px]" data-name="Container" />;
}

function Container17() {
  return (
    <div className="absolute h-[1118px] left-0 opacity-6 top-0 w-[744.477px]" data-name="Container">
      <Container18 />
      <Container19 />
      <Container20 />
    </div>
  );
}

function Container21() {
  return <div className="absolute h-[1118px] left-0 opacity-4 top-0 w-[744.477px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 744.48 1118\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -67.16 -67.16 0 372.24 559)\\'><stop stop-color=\\'rgba(255,255,255,1)\\' offset=\\'0.0013432\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.0013432\\'/></radialGradient></defs></svg>')" }} />;
}

function ImageInnoTaxi() {
  return (
    <div className="relative rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.2),0px_4px_6px_-4px_rgba(0,0,0,0.2)] shrink-0 size-[44px]" data-name="Image (InnoTaxi)">
      <div aria-hidden="true" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 pointer-events-none rounded-[14px]">
        <div className="absolute bg-[rgba(255,255,255,0)] bg-clip-padding border-0 border-[transparent] border-solid inset-0 rounded-[14px]" />
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid max-w-none object-cover rounded-[14px] size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[0px] text-[22px] text-white top-0 tracking-[-0.26px] whitespace-nowrap">
        <span className="leading-[33px]">Inno</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[33px] text-[rgba(255,255,255,0.6)]">Taxi</span>
      </p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.4)] top-[0.5px] tracking-[1.5px] uppercase whitespace-nowrap">Admin Portal</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[48px] relative shrink-0 w-[93.367px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[48px] items-center left-[48px] top-[48px] w-[648.477px]" data-name="Container">
      <ImageInnoTaxi />
      <Container23 />
    </div>
  );
}

function Container26() {
  return <div className="absolute bg-[#4ade80] left-[12px] opacity-99 rounded-[16777200px] size-[6px] top-[11.25px]" data-name="Container" />;
}

function Text10() {
  return (
    <div className="absolute h-[16.5px] left-[26px] top-[6px] w-[78.68px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.7)] top-[0.5px] tracking-[0.22px] whitespace-nowrap">System Online</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] border-solid h-[30.5px] left-0 rounded-[16777200px] top-0 w-[118.68px]" data-name="Container">
      <Container26 />
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[48px] left-0 not-italic text-[40px] text-white top-[-0.5px] tracking-[-0.4px] whitespace-nowrap">Your ride,</p>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[48px] left-0 not-italic text-[40px] text-[rgba(255,255,255,0.5)] top-[-0.5px] tracking-[-0.4px] whitespace-nowrap">your way.</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute content-stretch flex flex-col h-[96px] items-start left-0 top-[54.5px] w-[648.477px]" data-name="Heading 1">
      <Text11 />
      <Text12 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[71.391px] left-0 top-[170.5px] w-[340px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[23.8px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.55)] top-0 tracking-[-0.14px] w-[330px]">Admin dashboard for managing fleet operations, drivers, passengers, and ride analytics — all in one place.</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 12.8332">
            <path d={svgPaths.p1f07c700} id="Vector" stroke="var(--stroke-0, #FECACA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_37.5%_45.83%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 4.66667">
            <path d={svgPaths.p22c75d80} id="Vector" stroke="var(--stroke-0, #FECACA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.9)] top-[0.5px] whitespace-nowrap">Live Tracking</p>
      </div>
    </div>
  );
}

function PChip() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.15)] content-stretch flex gap-[8px] h-[36px] items-center left-0 px-[17px] py-px rounded-[16777200px] top-0 w-[132.586px]" data-name="PChip">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Text13 />
      <Text14 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #FECACA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-1/2 right-[33.33%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-12.5%_-25.01%_-12.5%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.50013 5.83346">
            <path d={svgPaths.pefda580} id="Vector" stroke="var(--stroke-0, #FECACA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.9)] top-[0.5px] whitespace-nowrap">24/7 Operations</p>
      </div>
    </div>
  );
}

function PChip1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.15)] content-stretch flex gap-[8px] h-[36px] items-center left-[142.59px] px-[17px] py-px rounded-[16777200px] top-0 w-[148.672px]" data-name="PChip">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Text15 />
      <Text16 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%_8.32%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 12.8353">
            <path d={svgPaths.p127cad00} id="Vector" stroke="var(--stroke-0, #FECACA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.9)] top-[0.5px] whitespace-nowrap">Secure Platform</p>
      </div>
    </div>
  );
}

function PChip2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.15)] content-stretch flex gap-[8px] h-[36px] items-center left-[301.26px] px-[17px] py-px rounded-[16777200px] top-0 w-[147.836px]" data-name="PChip">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Text17 />
      <Text18 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[36px] left-0 top-[265.89px] w-[648.477px]" data-name="Container">
      <PChip />
      <PChip1 />
      <PChip2 />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[301.891px] left-[48px] top-[423.8px] w-[648.477px]" data-name="Container">
      <Container25 />
      <Heading />
      <Paragraph5 />
      <Container27 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[239.875px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(255,255,255,0.3)] top-[0.5px] tracking-[0.11px] whitespace-nowrap">© 2026 InnoTaxi Service. Graduation Project.</p>
      </div>
    </div>
  );
}

function Container30() {
  return <div className="bg-white flex-[1_0_0] h-[6px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" />;
}

function Container31() {
  return <div className="bg-[rgba(255,255,255,0.25)] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Container32() {
  return <div className="bg-[rgba(255,255,255,0.25)] rounded-[16777200px] shrink-0 size-[6px]" data-name="Container" />;
}

function Container29() {
  return (
    <div className="h-[6px] relative shrink-0 w-[44px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative size-full">
        <Container30 />
        <Container31 />
        <Container32 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex h-[16.5px] items-center justify-between left-[48px] top-[1053.5px] w-[648.477px]" data-name="Container">
      <Paragraph6 />
      <Container29 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-gradient-to-b from-[#d32f2f] h-[1118px] left-0 overflow-clip to-[#ef5350] top-0 via-1/2 via-[#e53935] w-[744.477px]" data-name="Container">
      <Container17 />
      <Container21 />
      <Container22 />
      <Container24 />
      <Container28 />
    </div>
  );
}

export default function AdminDashboardPortal() {
  return (
    <div className="bg-white relative size-full" data-name="Admin Dashboard Portal">
      <Container />
      <Container16 />
    </div>
  );
}