// import React, { useState } from "react";
// import { useCombobox, useMultipleSelection } from "downshift";
// import { useDebounce } from "use-debounce";

// const menuMultipleStyles = {};
// const comboboxStyles = {};
// const comboboxWrapperStyles = {};
// const selectedItemStyles = {};
// const selectedItemIconStyles = {};
// const api_items = ["a", "b"];

// function DropdownMultipleCombobox() {
//   const [inputValue, setInputValue] = useState("");
//   const [debouncedInput] = useDebounce(inputValue, 300, {
//     equalityFn: (a, b) => a === b,
//   });

//   const {
//     getSelectedItemProps,
//     getDropdownProps,
//     addSelectedItem,
//     removeSelectedItem,
//     selectedItems,
//   } = useMultipleSelection();

//   const getFilteredItems = (items: string[]) =>
//     items.filter(
//       (item) =>
//         selectedItems.indexOf(item) < 0 &&
//         item.toLowerCase().startsWith(inputValue.toLowerCase())
//     );
//   const {
//     isOpen,
//     getToggleButtonProps,
//     getLabelProps,
//     getMenuProps,
//     getInputProps,
//     getComboboxProps,
//     highlightedIndex,
//     getItemProps,
//   } = useCombobox({
//     inputValue,
//     defaultHighlightedIndex: 0, // after selection, highlight the first item.
//     selectedItem: null,
//     items: getFilteredItems(api_items),

//     onStateChange: ({ inputValue, type, selectedItem }) => {
//       switch (type) {
//         case useCombobox.stateChangeTypes.InputChange:
//           setInputValue(inputValue);
//           break;
//         case useCombobox.stateChangeTypes.InputKeyDownEnter:
//         case useCombobox.stateChangeTypes.ItemClick:
//         case useCombobox.stateChangeTypes.InputBlur:
//           if (selectedItem) {
//             setInputValue("");
//             addSelectedItem(selectedItem);
//           }
//           break;
//         default:
//           break;
//       }
//     },
//   });
//   return (
//     <div>
//       <label {...getLabelProps()}>Choose some elements:</label>
//       <div style={comboboxWrapperStyles}>
//         {selectedItems.map((selectedItem, index) => (
//           <span
//             style={selectedItemStyles}
//             key={`selected-item-${index}`}
//             {...getSelectedItemProps({ selectedItem, index })}
//           >
//             {selectedItem}
//             <span
//               style={selectedItemIconStyles}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 removeSelectedItem(selectedItem);
//               }}
//             >
//               &#10005;
//             </span>
//           </span>
//         ))}
//         <div style={comboboxStyles} {...getComboboxProps()}>
//           <input
//             {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
//           />
//           <button {...getToggleButtonProps()} aria-label={"toggle menu"}>
//             &#8595;
//           </button>
//         </div>
//       </div>
//       <ul {...getMenuProps()} style={menuMultipleStyles}>
//         {isOpen &&
//           getFilteredItems(items).map((item, index) => (
//             <li
//               style={
//                 highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
//               }
//               key={`${item}${index}`}
//               {...getItemProps({ item, index })}
//             >
//               {item}
//             </li>
//           ))}
//       </ul>
//     </div>
//   );
// }

// export default DropdownMultipleCombobox;
export {};
