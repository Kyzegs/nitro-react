import { RequestBadgesComposer } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { LocalizeBadgeName } from '../../../../utils/LocalizeBageName';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { BadgeImageView } from '../../../badge-image/BadgeImageView';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryBadgeActions } from '../../reducers/InventoryBadgeReducer';
import { InventoryBadgeViewProps } from './InventoryBadgeView.types';
import { InventoryBadgeResultsView } from './results/InventoryBadgeResultsView';

export const InventoryBadgeView: FC<InventoryBadgeViewProps> = props =>
{
    const { badgeState = null, dispatchBadgeState = null } = useInventoryContext();
    const { needsBadgeUpdate = false, badge = null, badges = [], activeBadges = [] } = badgeState;

    useEffect(() =>
    {
        if(needsBadgeUpdate)
        {
            dispatchBadgeState({
                type: InventoryBadgeActions.SET_NEEDS_UPDATE,
                payload: {
                    flag: false
                }
            });
            
            SendMessageHook(new RequestBadgesComposer());
        }
        else
        {
            dispatchBadgeState({
                type: InventoryBadgeActions.SET_BADGE,
                payload: {
                    badgeCode: null
                }
            });
        }

    }, [ needsBadgeUpdate, badges, dispatchBadgeState ]);

    useEffect(() =>
    {
        // update current badge
    }, [ badge ]);

    return (
        <>
            <div className="row">
                <div className="col-7">
                    <InventoryBadgeResultsView badges={ badges } cols={ 5 }  />
                </div>
                <div className="col-5">
                    <InventoryBadgeResultsView badges={ activeBadges } cols={ 3 }  />
                </div>
            </div>
            { badge && badge.length &&
                <div className="d-flex justify-content-between align-items-center bg-secondary rounded p-1 mb-1">
                    <div className="d-flex flex-grow-1 current-badge-container">
                        <BadgeImageView badgeCode={ badge } />
                        <div className="d-flex flex-column justify-content-center flex-grow-1 ms-2">
                            <p className="mb-0">{ LocalizeBadgeName(badge) }</p>
                        </div>
                    </div>
                </div> }
            <div className="d-flex justify-content-center align-items-center bg-primary rounded p-1">
                <div className="h6 m-0 text-white">{ LocalizeText('achievements_score_description', [ 'score' ], [ '0' ]) }</div>
            </div>
        </>
    );
}