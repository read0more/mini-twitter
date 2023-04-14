import React from 'react';
import { createPortal } from 'react-dom';
import TwitterLogo from './twitterLogo';

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  alignCenter?: boolean;
  isAllowClose?: boolean;
  toggle: () => void;
}

export default function Modal({
  children,
  isOpen,
  alignCenter = false,
  isAllowClose = true,
  toggle,
}: Props) {
  return isOpen
    ? createPortal(
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          onClick={isAllowClose ? toggle : () => {}}
        >
          <div
            className="bg-white w-1/2 h-1/2 rounded-lg p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <div
                className={`grid ${
                  isAllowClose ? 'grid-cols-3' : ''
                } items-center`}
              >
                {isAllowClose && (
                  <button
                    className="bg-blue-500 text-white rounded-full w-6 h-6 flex justify-center items-center m-3"
                    onClick={() => toggle()}
                  >
                    X
                  </button>
                )}
                <TwitterLogo className="w-10 h-10 mx-auto" />
              </div>
              <div
                className={`flex-1 flex flex-col ${
                  alignCenter ? 'justify-center' : ''
                }`}
              >
                {children}
              </div>
            </div>
          </div>
        </div>,
        document.getElementById('modal') as HTMLElement
      )
    : null;
}
